from PIL import Image
import numpy as np
import glob

# Find the file by glob pattern
files = glob.glob(r"C:\Users\LocalAdmin\Desktop\jimeng-2026-05-16-9967-*.png")
if not files:
    raise FileNotFoundError("Source image not found on Desktop")
input_path = files[0]
output_path = r"E:\app\public\mascot.png"

# 打开原图（未放大版本）
img = Image.open(input_path).convert("RGBA")
w, h = img.size
print(f"Original size: {w}x{h}")

arr = np.array(img)

# ========== 1. 去除白色背景 ==========
# 策略：将接近白色的像素设为透明，但保留主体内部的白色（如眼白）
# 通过alpha通道的连通性来判断：先找到所有非白色像素作为主体mask

# 判断白色背景：亮度高且饱和度低
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
brightness = (r.astype(int) + g.astype(int) + b.astype(int)) / 3
max_diff = np.maximum.reduce([r, g, b]) - np.minimum.reduce([r, g, b])

# 白色背景条件：亮度>230 且 色差<30
is_white_bg = (brightness > 230) & (max_diff < 30)

# 将白色背景设为透明
arr[is_white_bg] = [0, 0, 0, 0]

# ========== 2. 去除残留杂边（浅灰色过渡） ==========
# 进一步处理亮度高但略有颜色的边缘
brightness2 = (arr[:,:,0].astype(int) + arr[:,:,1].astype(int) + arr[:,:,2].astype(int)) / 3
is_light_edge = (brightness2 > 200) & (arr[:,:,3] > 0) & (max_diff < 50)
arr[is_light_edge] = [0, 0, 0, 0]

# ========== 3. 眼珠改黑色 ==========
# 眼睛区域：在图片中上部，通常是深棕色/深灰色圆形区域
# 先找到所有非透明像素中的深色区域

# 创建非透明mask
non_transparent = arr[:,:,3] > 0

# 每个像素的亮度
pixel_brightness = (arr[:,:,0].astype(int) + arr[:,:,1].astype(int) + arr[:,:,2].astype(int)) / 3

# 深色区域：亮度 < 80 且 非透明
is_dark = non_transparent & (pixel_brightness < 80)

# 但我们需要找到眼睛的深色区域（通常是圆形，位于图片上半部分）
# 找到所有深色像素的坐标
dark_coords = np.argwhere(is_dark)

if len(dark_coords) > 0:
    # 图片上半部分的深色像素更可能是眼睛
    upper_half = dark_coords[dark_coords[:,0] < h * 0.7]

    if len(upper_half) > 0:
        # 对深色像素进行聚类，找到两个眼睛区域
        # 简单方法：按x坐标排序，分成左右两组
        sorted_by_x = upper_half[np.argsort(upper_half[:,1])]
        mid_x = w // 2

        left_eye = sorted_by_x[sorted_by_x[:,1] < mid_x]
        right_eye = sorted_by_x[sorted_by_x[:,1] >= mid_x]

        # 将眼睛深色区域改为纯黑色
        for eye in [left_eye, right_eye]:
            if len(eye) > 10:
                # 找出该眼的边界框
                y_min, y_max = eye[:,0].min(), eye[:,0].max()
                x_min, x_max = eye[:,1].min(), eye[:,1].max()

                # 在边界框内，将深色像素（亮度<100）设为纯黑
                eye_region = arr[y_min:y_max+1, x_min:x_max+1]
                eye_brightness = (eye_region[:,:,0].astype(int) + eye_region[:,:,1].astype(int) + eye_region[:,:,2].astype(int)) / 3
                eye_mask = (eye_region[:,:,3] > 0) & (eye_brightness < 100)

                # 只改中心更暗的部分（瞳孔）
                center_y, center_x = (y_max - y_min) // 2, (x_max - x_min) // 2
                dist_from_center = np.sqrt((np.arange(eye_region.shape[0])[:,None] - center_y)**2 + (np.arange(eye_region.shape[1])[None,:] - center_x)**2)
                pupil_mask = eye_mask & (dist_from_center < min(eye_region.shape) * 0.5)

                arr[y_min:y_max+1, x_min:x_max+1][pupil_mask] = [20, 20, 20, 255]

# ========== 4. 缩放 ==========
# 裁剪到有效区域
img_processed = Image.fromarray(arr, 'RGBA')
bbox = img_processed.getbbox()
if bbox:
    img_processed = img_processed.crop(bbox)

# 放大150%
cw, ch = img_processed.size
new_w = int(cw * 1.5)
new_h = int(ch * 1.5)
img_final = img_processed.resize((new_w, new_h), Image.LANCZOS)

img_final.save(output_path, "PNG")
print(f"Saved: {new_w}x{new_h}")

# 验证
check = np.array(img_final)
non_trans = np.sum(check[:,:,3] > 0)
total = check.shape[0] * check.shape[1]
print(f"Non-transparent: {non_trans}/{total} ({non_trans/total*100:.1f}%)")
