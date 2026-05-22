from PIL import Image
import sys

input_path = r"E:\app\public\mascot.png"
output_path = r"E:\app\public\mascot.png"

img = Image.open(input_path).convert("RGBA")
w, h = img.size

# 1. 去除黑色背景和灰色边框（将接近黑色的像素设为透明）
pixels = img.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # 判断是否为黑色背景或灰色边框
        # 黑色背景：RGB都很低
        # 灰色边框：RGB相近且中等亮度
        brightness = (r + g + b) / 3
        is_black = brightness < 30
        is_gray_border = abs(int(r) - int(g)) < 15 and abs(int(g) - int(b)) < 15 and 40 < brightness < 120
        if is_black or is_gray_border:
            pixels[x, y] = (0, 0, 0, 0)

# 2. 找到非透明区域的边界框
bbox = img.getbbox()
if bbox:
    left, top, right, bottom = bbox
    # 稍微扩展一点边距，避免切到主体
    padding = 10
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(w, right + padding)
    bottom = min(h, bottom + padding)
    cropped = img.crop((left, top, right, bottom))
else:
    cropped = img

# 3. 放大主体 50%（即 scale = 1.5）
cw, ch = cropped.size
new_w = int(cw * 1.5)
new_h = int(ch * 1.5)
scaled = cropped.resize((new_w, new_h), Image.LANCZOS)

# 4. 保存
scaled.save(output_path, "PNG")
print(f"Done. Original: {w}x{h} -> Cropped: {cw}x{ch} -> Scaled: {new_w}x{new_h}")
