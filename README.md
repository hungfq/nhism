# 💗 Quà tặng bạn gái — web tĩnh

Một trang web nhỏ (HTML + CSS + JS thuần, **không cần build, không thư viện**) để tặng người thương.
Chạy được ngay trên GitHub Pages.

## Có gì trong này

| Phần | Mô tả |
|---|---|
| Hero | Tên nàng + dòng chữ tự gõ |
| Bộ đếm | Đã bên nhau bao nhiêu ngày/giờ/phút/giây + đếm ngược tới kỷ niệm sau |
| Kỷ niệm | Timeline các mốc quan trọng |
| Ảnh | Lưới ảnh + xem phóng to (bấm, hoặc phím ← → và Esc) |
| Lý do | Bấm nút rút ngẫu nhiên một lý do, không lặp lại cho tới khi hết bộ |
| Quà | Hộp quà mở ra lá thư, kèm mưa tim |
| Nhạc | Nút bật/tắt nhạc nền (tuỳ chọn) |

## Cách sửa nội dung

Sửa **duy nhất** file [`js/config.js`](js/config.js): tên, ngày yêu nhau, timeline, ảnh, lý do, lá thư.

```js
window.GIFT_CONFIG = {
  herName: 'Mèo Con',
  myName:  'Anh',
  startDate: '2023-02-14T20:00:00+07:00',   // ngày bắt đầu (giờ VN)
  ...
};
```

### Thêm ảnh

1. Bỏ ảnh vào `assets/photos/` (đặt tên `1.jpg`, `2.jpg`, …).
2. Khai báo trong `config.js`:

```js
photos: [
  { src: 'assets/photos/1.jpg', caption: 'Lần đầu mình đi chơi xa' }
]
```

Ảnh chưa có sẽ tự hiện khung màu dễ thương thay thế, **không vỡ layout**.
Nên nén ảnh xuống dưới ~300 KB mỗi tấm cho nhẹ.

### Thêm nhạc (tuỳ chọn)

Bỏ file vào `assets/song.mp3` rồi đổi trong `config.js`:

```js
music: 'assets/song.mp3'
```

Nút 🎵 sẽ tự xuất hiện ở góc phải. (Trình duyệt chặn tự phát nhạc, nên phải bấm — đúng chuẩn.)

### Đổi màu

Tone hiện tại: **tím nhạt + hồng nhạt** trên nền pastel sáng. Sửa các biến ở đầu [`css/style.css`](css/style.css):

| Biến | Dùng cho |
|---|---|
| `--lilac` / `--pink` | màu chủ đạo: nền khối, nút, viền, hộp quà |
| `--lilac-deep` / `--pink-text` | bản đậm hơn, **chỉ dùng cho chữ** (giữ tương phản ≥ 4.5:1) |
| `--bg` / `--bg-alt` | nền trang và nền section xen kẽ |
| `--text` / `--muted` | chữ chính và chữ phụ |

> Nếu đổi `--lilac`/`--pink` sang màu đậm hơn, nhớ đổi cả `--lilac-deep`/`--pink-text`
> cho cùng tông — hai biến này là màu chữ nên đừng để quá nhạt.

## Xem thử ở máy

Mở thẳng `index.html` bằng trình duyệt là chạy được. Hoặc dùng server tĩnh cho giống thật:

```bash
python3 -m http.server 8000
# rồi mở http://localhost:8000
```

## Deploy lên GitHub Pages

```bash
git add -A
git commit -m "feat: trang quà tặng"
git push origin main
```

Rồi trên GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.**

Đợi ~1 phút, trang sẽ ở:

```
https://<tên-github>.github.io/<tên-repo>/
```

> Mọi đường dẫn trong code đều là **đường dẫn tương đối** (`css/style.css`, `assets/…`)
> nên chạy đúng cả khi site nằm trong thư mục con của Pages.
> File `.nojekyll` giúp GitHub không xử lý qua Jekyll.

## Cấu trúc

```
.
├── index.html
├── css/style.css
├── js/config.js      ← sửa nội dung ở đây
├── js/main.js
├── assets/photos/    ← bỏ ảnh vào đây
└── .nojekyll
```

## Ghi chú kỹ thuật

- Không dùng ES module → mở bằng `file://` vẫn chạy (không dính CORS).
- Có hỗ trợ bàn phím và `aria-label` cho phần xem ảnh / lá thư.
- Tôn trọng `prefers-reduced-motion`: người dùng tắt hiệu ứng thì trang không có animation.
- Font lấy từ Google Fonts; mất mạng vẫn có font dự phòng của hệ thống.
