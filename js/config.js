/* =============================================================
 *  CONFIG — Sửa MỌI nội dung ở file này. Không cần đụng file khác.
 *  Lưu file, mở lại trang là thấy đổi ngay.
 * ============================================================= */
window.GIFT_CONFIG = {

    /* --- Tên gọi --- */
    herName: 'Nhism',          // tên/biệt danh của nàng
    myName: 'Hwng',               // tên bạn ký ở cuối thư

    /* --- Ngày bắt đầu yêu nhau (giờ Việt Nam +07:00) ---
       Định dạng: 'YYYY-MM-DDTHH:mm:ss+07:00'                       */
    startDate: '2023-05-13T20:00:00+07:00',

    /* --- Dòng chữ chạy ở đầu trang (gõ từng chữ) --- */
    taglines: [
        'Cảm ơn em vì đã ở đây.',
        'Mỗi ngày có em đều là ngày đẹp.',
        'Trang này anh làm riêng cho iem ❤️'
    ],

    /* --- Mốc kỷ niệm --- */
    timeline: [
        {date: '2022-11-29', title: 'Lần đầu gặp em', text: 'Ngầu quó'},
        {date: '2023-05-13', title: 'Ngày mình bắt đầu', text: 'Câu trả lời “ừ” của em là câu hay nhất anh từng nghe.'},
        {date: '2023-06-02', title: 'Chuyến đi đầu tiên', text: 'Có núi, có biển và có iemmm'},
        {date: '2024-10-18', title: 'Thăm baria', text: 'É hè hè, của ta....'}
    ],

    /* --- Ảnh ---
       Bỏ ảnh vào thư mục assets/photos/ rồi khai báo ở đây.
       Ảnh chưa có sẽ tự hiện khung placeholder dễ thương, không vỡ layout. */
    photos: [
        {src: 'assets/photos/1.jpg', caption: 'Lần đầu mình đi chơi xa'},
        {src: 'assets/photos/2.jpg', caption: 'Em và ly trà sữa quen thuộc'},
        {src: 'assets/photos/3.jpg', caption: 'Hoàng hôn hôm đó đẹp thật'},
        {src: 'assets/photos/4.jpg', caption: 'Cười xấu mà anh vẫn thích'},
        {src: 'assets/photos/5.jpg', caption: 'Sinh nhật em năm ngoái'},
        {src: 'assets/photos/6.jpg', caption: 'Ngày thường, mà vui'}
    ],

    /* --- Lý do thương em (bấm nút rút ngẫu nhiên) --- */
    reasons: [
        'Vì em cười là anh hết mệt.',
        'Vì em kiên nhẫn với anh cả những lúc anh khó ưa.',
        'Vì em ăn gì cũng khen ngon, kể cả món anh nấu hỏng.',
        'Vì em nhớ những chi tiết nhỏ mà anh kể qua loa.',
        'Vì bên em anh được là chính mình, không cần cố gắng.',
        'Vì em làm những ngày bình thường trở nên đáng nhớ.',
        'Vì em dỗi rất nhanh mà làm lành còn nhanh hơn.',
        'Vì em là người anh muốn kể đầu tiên khi có chuyện vui.'
    ],

    /* --- Lá thư trong hộp quà (mỗi dòng là một đoạn) --- */
    letter: {
        title: 'Gửi em,',
        paragraphs: [
            'Anh không giỏi nói mấy lời ngọt ngào, nên anh ngồi gõ từng dòng này cho iem.',
            'Cảm ơn em vì đã đi cùng anh qua những ngày dễ và cả những ngày không dễ chút nào. Có em, mọi thứ nhẹ đi rất nhiều.',
            'Anh không hứa những điều to tát. Anh chỉ hứa sẽ cố gắng mỗi ngày, để em luôn thấy mình được thương.',
            'Yêu em, nhiều hơn hôm qua một chút.'
        ]
    },

    /* --- Dòng cuối trang --- */
    footerNote: 'Làm bằng tay, bằng HTML, và bằng thương em.',

    /* --- Nhạc nền (tuỳ chọn) ---
       Để null nếu không dùng. Nếu dùng: bỏ file vào assets/song.mp3
       rồi đổi thành 'assets/song.mp3' — nút bật nhạc sẽ tự hiện. */
    music: null
};
