from PIL import Image
import numpy as np
import os

mascot_path = r"E:\app\public\mascot.png"
output_dir = r"E:\app\public"

if not os.path.exists(mascot_path):
    print("错误: mascot.png 不存在")
    exit(1)

img = Image.open(mascot_path).convert("RGBA")
arr = np.array(img)

print(f"尺寸: {img.size[0]}x{img.size[1]}")
print(f"模式: {img.mode}")
print()

# 检查边缘像素质量
alpha = arr[:,:,3]
height, width = alpha.shape

# 分析边缘像素（alpha值为 1-254 的像素）
edge_pixels = (alpha > 0) & (alpha < 255)
edge_count = np.sum(edge_pixels)
print(f"半透明边缘像素: {edge_count} ({edge_count/(width*height)*100:.2f}%)")

if edge_count > 0:
    edge_r = arr[:,:,0][edge_pixels]
    edge_g = arr[:,:,1][edge_pixels]
    edge_b = arr[:,:,2][edge_pixels]
    edge_a = alpha[edge_pixels]

    # 检查是否有接近白色的边缘残留
    edge_brightness = (edge_r.astype(int) + edge_g.astype(int) + edge_b.astype(int)) / 3
    white_edges = np.sum(edge_brightness > 200)
    print(f"边缘中接近白色的像素: {white_edges} ({white_edges/max(1,edge_count)*100:.1f}%)")
print()

# ---- 多背景渲染测试 ----
backgrounds = {
    "white": (255, 255, 255),
    "light_gray": (240, 240, 245),
    "dark": (30, 30, 50),
    "blue": (99, 102, 241),
    "red": (200, 16, 46),
    "green": (34, 197, 94),
}

for bg_name, bg_color in backgrounds.items():
    bg = Image.new("RGBA", img.size, bg_color + (255,))
    composed = Image.alpha_composite(bg, img)
    out_path = os.path.join(output_dir, f"mascot_test_{bg_name}.png")
    composed.save(out_path)
    
    # 检查合成后边缘是否有异常颜色
    comp_arr = np.array(composed)
    comp_edge_pixels = (alpha > 0) & (alpha < 255)
    if np.sum(comp_edge_pixels) > 0:
        ce_r = comp_arr[:,:,0][comp_edge_pixels]
        ce_g = comp_arr[:,:,1][comp_edge_pixels]
        ce_b = comp_arr[:,:,2][comp_edge_pixels]
        # 检查与背景的色差
        expected = np.array(bg_color[:3])
        diff = np.sqrt((ce_r.astype(float)-expected[0])**2 + (ce_g.astype(float)-expected[1])**2 + (ce_b.astype(float)-expected[2])**2)
        max_diff = diff.max()
        print(f"[{bg_name:>10}] 保存: mascot_test_{bg_name}.png  | 边缘最大色差: {max_diff:.1f}")

# 分析主体四周边缘
print("\n--- 上下左右四边透明检查 ---")
# 上边缘：逐行扫描，找到第一个非透明行
for y in range(height):
    if np.any(alpha[y, :] > 128):
        print(f"  顶部透明边距: {y}px")
        break

# 下边缘
for y in range(height-1, -1, -1):
    if np.any(alpha[y, :] > 128):
        print(f"  底部透明边距: {height-1-y}px")
        break

# 左边缘
for x in range(width):
    if np.any(alpha[:, x] > 128):
        print(f"  左侧透明边距: {x}px")
        break

# 右边缘
for x in range(width-1, -1, -1):
    if np.any(alpha[:, x] > 128):
        print(f"  右侧透明边距: {width-1-x}px")
        break

print("\n测试完成! 请在 public/ 目录下查看 mascot_test_*.png 文件")
