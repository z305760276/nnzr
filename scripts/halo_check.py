from PIL import Image
import numpy as np

mascot_path = r"E:\app\public\mascot.png"
img = Image.open(mascot_path).convert("RGBA")
arr = np.array(img)
h, w = arr.shape[:2]

# 检查每个边缘像素在不同背景下的视觉差异
backgrounds = {
    "dark_bg": np.array([30, 30, 50], dtype=float),
    "light_bg": np.array([240, 240, 245], dtype=float),
    "gradient_bg": np.array([100, 80, 120], dtype=float),
}

alpha = arr[:,:,3].astype(float) / 255.0
rgb = arr[:,:,:3].astype(float)

for bg_name, bg_color in backgrounds.items():
    # Alpha composite
    composed = rgb * alpha[:,:,np.newaxis] + bg_color[np.newaxis,np.newaxis,:] * (1 - alpha[:,:,np.newaxis])
    composed = np.clip(composed, 0, 255).astype(np.uint8)

    # 只检查半透明边缘像素
    edge_mask = (arr[:,:,3] > 0) & (arr[:,:,3] < 255)
    edge_count = np.sum(edge_mask)

    if edge_count == 0:
        continue

    edge_composed = composed[edge_mask]
    edge_bg = bg_color.astype(np.uint8)

    # 计算边缘像素与纯背景的差异
    diff = np.sqrt(np.sum((edge_composed.astype(float) - edge_bg[np.newaxis,:])**2, axis=1))

    # 统计差异大于20的像素（肉眼可见的差异）
    visible_diff = np.sum(diff > 20)
    
    # 最大差异
    max_diff = diff.max()
    avg_diff = diff.mean()

    print(f"[{bg_name}]")
    print(f"  边缘像素与背景的平均差异: {avg_diff:.1f}")
    print(f"  最大差异: {max_diff:.1f}")
    print(f"  肉眼可见差异的像素: {visible_diff}/{edge_count} ({visible_diff/edge_count*100:.1f}%)")

    # 检查是否有"光晕"效应：边缘像素显著亮于背景
    if bg_name == "dark_bg":
        # 对深色背景，检查边缘像素的亮度是否异常高
        edge_brightness = np.mean(edge_composed, axis=1)
        bg_brightness = np.mean(bg_color)
        bright_pixels = np.sum(edge_brightness > bg_brightness + 30)
        print(f"  比背景亮30+的像素: {bright_pixels}/{edge_count} ({bright_pixels/edge_count*100:.1f}%)")
        
        # 这些像素的 RGB 和 alpha
        bright_mask = edge_brightness > bg_brightness + 30
        if np.sum(bright_mask) > 0:
            bright_px = edge_composed[bright_mask]
            bright_alpha = arr[:,:,3][edge_mask][bright_mask]
            avg_bright_rgb = bright_px.mean(axis=0)
            avg_bright_alpha = bright_alpha.mean()
            print(f"  亮像素平均颜色: RGB({avg_bright_rgb[0]:.0f},{avg_bright_rgb[1]:.0f},{avg_bright_rgb[2]:.0f}), alpha={avg_bright_alpha:.1f}")
    
    print()

# 总体评估
print("=== 总体评估 ===")
print(f"图像尺寸: {w}x{h}")
print(f"总像素: {w*h}")
print(f"半透明边缘像素: {np.sum((arr[:,:,3]>0)&(arr[:,:,3]<255))}")
print(f"完全不透明像素: {np.sum(arr[:,:,3]==255)}")
print(f"完全透明像素: {np.sum(arr[:,:,3]==0)}")

# 检查边缘是否在深色背景上形成"白圈"
edge_mask = (arr[:,:,3] > 0) & (arr[:,:,3] < 255)
if np.sum(edge_mask) > 0:
    edge_alpha = arr[:,:,3][edge_mask]
    edge_rgb = arr[:,:,:3][edge_mask]
    
    # 如果边缘像素 RGB 值高但 alpha 低，在深色背景上可能不明显
    # 如果边缘像素 RGB 值高且 alpha 也高，则会产生可见白色光晕
    edge_rgb_mean = np.mean(edge_rgb, axis=1)
    problem_pixels = np.sum((edge_rgb_mean > 200) & (edge_alpha > 100))
    print(f"\n高RGB+高Alpha的边缘像素（可能产生光晕）: {problem_pixels}")
    print(f"占边缘像素比例: {problem_pixels/max(1,np.sum(edge_mask))*100:.1f}%")
