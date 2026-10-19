#!/usr/bin/env python3
# 生成牧泽通讯录二维码（带/不带 logo）
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "qr"
OUT.mkdir(parents=True, exist_ok=True)

URL = "https://wytq-da88.github.io/muze-sales/"
LOGO = ROOT / "public" / "logo.png"

def make_qr(with_logo=True):
    import qrcode
    from qrcode.constants import ERROR_CORRECT_H
    from PIL import Image

    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=18,
        border=4,
    )
    qr.add_data(URL)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#1b2724", back_color="white").convert("RGB")

    if with_logo and LOGO.exists():
        logo = Image.open(LOGO).convert("RGBA")
        # 裁掉透明边
        bbox = logo.getbbox()
        if bbox:
            logo = logo.crop(bbox)
        # logo 占二维码宽度的比例（H 纠错可承受 ~22%）
        ratio = 0.20
        lw = int(img.size[0] * ratio)
        logo = logo.resize((lw, lw), Image.LANCZOS)
        # 圆角白底托盘
        pad = int(lw * 0.12)
        tray = Image.new("RGBA", (lw + pad * 2, lw + pad * 2), (255, 255, 255, 255))
        tray.paste(logo, (pad, pad), logo)
        pos = ((img.size[0] - tray.size[0]) // 2, (img.size[1] - tray.size[1]) // 2)
        img.paste(tray, pos, tray)

    name = "site.png" if with_logo else "site_nologo.png"
    img.save(OUT / name, quality=95)
    print("saved:", OUT / name, img.size)

if __name__ == "__main__":
    for w in (True, False):
        make_qr(w)
