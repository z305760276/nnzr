from PIL import Image, ImageFilter
import numpy as np
import os
import sys

project_root = r"E:\app"
input_path = os.path.join(project_root, "AI助手形象.png")
output_path = os.path.join(project_root, "public", "mascot.png")

print(f"输入: {input_path}")
print(f"输出: {output_path}")

if not os.path.exists(input_path):
    print("错误: 找不到输入文件")
    sys.exit(1)

img = Image.open(input_path).convert("RGBA")
w, h = img.size
print(f"原始尺寸: {w}x{h}")

arr = np.array(img)

# 步骤1: 创建可靠的二值掩码
print("步骤1: 生成主体掩码...")
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
brightness = (r.astype(int) + g.astype(int) + b.astype(int)) / 3
max_diff = np.maximum.reduce([r, g, b]) - np.minimum.reduce([r, g, b])

is_white = (brightness > 220) & (max_diff < 35)
body_mask = ~is_white

mask_img = Image.fromarray((body_mask.astype(np.uint8)) * 255, mode='L')
mask_cleaned = mask_img.filter(ImageFilter.MinFilter(5))
mask_cleaned = mask_cleaned.filter(ImageFilter.MaxFilter(7))
mask_cleaned = mask_cleaned.filter(ImageFilter.MedianFilter(5))
mask_arr = np.array(mask_cleaned) > 0

print(f"  掩码有效像素: {np.sum(mask_arr)}/{w*h} ({np.sum(mask_arr)/(w*h)*100:.1f}%)")

# 步骤2: 用掩码提取主体 + 边缘扩展
print("步骤2: 提取主体并边缘处理...")

out = np.zeros((h, w, 4), dtype=np.uint8)
out[mask_arr] = arr[mask_arr]

mask_uint8 = mask_arr.astype(np.uint8) * 255
mask_dilated = np.array(Image.fromarray(mask_uint8, mode='L').filter(ImageFilter.MaxFilter(3))) > 0
outer_edge = mask_dilated & ~mask_arr

print(f"  外边缘修复像素: {np.sum(outer_edge)}")

edge_ys, edge_xs = np.where(outer_edge)
for ey, ex in zip(edge_ys, edge_xs):
    y0, y1 = max(0, ey-1), min(h, ey+2)
    x0, x1 = max(0, ex-1), min(w, ex+2)
    window = out[y0:y1, x0:x1]
    body_px = window[window[:,:,3] > 0]
    if len(body_px) > 0:
        out[ey, ex, :3] = body_px[:, :3].mean(axis=0).astype(np.uint8)
        out[ey, ex, 3] = 255

# 步骤3: 最终 alpha 羽化
print("步骤3: 边缘羽化...")

alpha_raw = (out[:,:,3] > 0).astype(np.uint8) * 255
alpha_img = Image.fromarray(alpha_raw, mode='L')
alpha_blurred = alpha_img.filter(ImageFilter.GaussianBlur(radius=1.5))
alpha_arr = np.array(alpha_blurred)

out[:,:,3] = alpha_arr

# 羽化后颜色修复
print("  羽化后颜色修复...")
semi_transparent = (alpha_arr > 0) & (alpha_arr < 255)
st_ys, st_xs = np.where(semi_transparent)
for ey, ex in zip(st_ys, st_xs):
    y0_2, y1_2 = max(0, ey-2), min(h, ey+3)
    x0_2, x1_2 = max(0, ex-2), min(w, ex+3)
    window = out[y0_2:y1_2, x0_2:x1_2]
    opaque = window[window[:,:,3] > 240]
    if len(opaque) > 0:
        out[ey, ex, :3] = opaque[:, :3].mean(axis=0).astype(np.uint8)

# 步骤4: 裁剪
print("步骤4: 裁剪...")
img_out = Image.fromarray(out, 'RGBA')
bbox = img_out.getbbox()

if bbox:
    padding = 15
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(w, bbox[2] + padding)
    bottom = min(h, bbox[3] + padding)
    print(f"  裁剪区域: ({left}, {top}, {right}, {bottom})")
    img_cropped = img_out.crop((left, top, right, bottom))
else:
    img_cropped = img_out

# 步骤5: 缩放到标准尺寸
print("步骤5: 缩放...")
target_height = 450
cw, ch = img_cropped.size
scale = target_height / ch
new_w = int(cw * scale)
new_h = target_height
img_final = img_cropped.resize((new_w, new_h), Image.LANCZOS)
print(f"  最终尺寸: {new_w}x{new_h}")

# 步骤6: 保存
img_final.save(output_path, "PNG")
print("处理完成!")

# 验证
check = np.array(img_final)
non_trans = np.sum(check[:,:,3] > 10)
total = check.shape[0] * check.shape[1]
edge_count = np.sum((check[:,:,3] > 0) & (check[:,:,3] < 255))

print(f"\n=== 验证 ===")
print(f"  - 非透明像素: {non_trans}/{total} ({non_trans/total*100:.1f}%)")
print(f"  - 半透明边缘像素: {edge_count}")
print(f"  - Alpha 范围: {check[:,:,3].min()} - {check[:,:,3].max()}")
