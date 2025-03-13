import style from "./ProductDetail.module.css";
import classNames from "classnames/bind";

const cn = classNames.bind(style);

export default function ProductDetail() {

    return (
        <>
        <img src="http://localhost:8080/image/34132106032025_clean-code.png" alt="" />
            {/* <!-- breadcrumb-divider và các thông báo thành công và lỗi --> */}
            <div class="container">
                <div class="row">
                    {/* <!-- breadcrumb-divider --> */}
                    <section class="breadcrumb-divider col-lg-6">
                        <div class="container">
                            <nav  aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="/">Trang chủ</a></li>
                                    <li class="breadcrumb-item active" aria-current="page"> <a href="/products?categoryId[]=<?= html_escape($book->categoryId) ?>">
                                        Phân bón
                                    </a></li>
                                </ol>
                            </nav>
                        </div>
                    </section>
                    {/* <!-- end breadcrumb-divider --> */}

                </div>
            </div>
            {/* <!-- end breadcrumb-divider và các thông báo thành công và lỗi --> */}

            {/* <!-- product detail --> */}
            <section class="product-detail">
                <div class="container">
                    <div class="row">
                        {/* <!-- Những image của sản phẩm --> */}
                        <div class="col-lg-5">
                            <div class="product-imgs">
                                <div
                                    class="swiper mySwiper2">
                                    {/* <!-- image top --> */}
                                    <div class="swiper-wrapper">
                                        <div class="swiper-slide">
                                            <img src="/assets/img/book/<?= html_escape($img) ?>" />
                                        </div>
                                    </div>
                                    <div class="swiper-button-next"></div>
                                    <div class="swiper-button-prev"></div>
                                </div>
                                {/* <!-- image bottom --> */}
                                <div thumbsSlider="" class="swiper mySwiper swipper-bottom">
                                    <div class="swiper-wrapper">
                                        <div class="swiper-slide">
                                            <img src="/assets/img/book/<?= html_escape($img) ?>" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- end Những image của sản phẩm --> */}

                        {/* <!-- Thông tin sản phẩm và button mua và thêm vào giỏ hàng --> */}
                        <div class="col-lg-7">
                            <div class="detail-content">
                                <div class="info">
                                    {/* <!-- Name --> */}
                                    <h1 class="name-product">
                                    </h1>
                                    {/* <!-- info --> */}
                                    <div class="product-view row">
                                        <div class="col-lg-6 nxb">
                                            <span>
                                                Nhà xuất bản:
                                            </span>
                                            <span>
                                            </span>
                                        </div>
                                        <div class="col-lg-6 nxb">
                                            <span>
                                                Tác giả:
                                            </span>
                                            <span>
                                            </span>
                                        </div>
                                        <div class="col-lg-6 nxb">
                                            <span>
                                                Thể loại:
                                            </span>
                                            <span>
                                            </span>
                                        </div>
                                    </div>
                                    {/* <!-- Điểm đánh giá --> */}
                                    <div class="product-view-rate">
                                        <div class="rating">
                                            <span class="rating-number"></span>
                                            <div class="star-icon text-center">
                                                <i class="fa-regular fa-star"></i>
                                                <i class="fa-regular fa-star"></i>
                                                <i class="fa-regular fa-star"></i>
                                                <i class="fa-regular fa-star"></i>
                                                <i class="fa-regular fa-star"></i>
                                                <div class="full-state" >
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- Giá --> */}
                                    <div class="price-product">
                                        <div class="current-price">
                                            <span></span>
                                            <sup>đ</sup>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- Mua hàng và thêm vào giỏ hàng --> */}
                                <form action="/shopping-cart/store" method="post">
                                    {/* <!-- Số lượng mua --> */}
                                    <div class="quantity-product">
                                        <i class="fa-solid fa-minus minus-product"></i>
                                        <input class="quantity" type="number" value="1" name="quantity"></input>
                                        <i class="fa-solid fa-plus add-product"></i>
                                    </div>
                                    <input type="hidden" name="bookId" value="<?= $book->id ?>" />
                                    {/* <!-- button mua và thêm vào giỏ hàng --> */}
                                    <div class="btn-product row">
                                        <div class="col-6">
                                            <button type="submit" class="btn-add-cart btn-2" name="action" value="add-shopping-cart">
                                                <span>
                                                    <i class="fa-solid fa-cart-shopping"></i>
                                                </span>
                                                <span>Thêm vào giỏ hàng</span>
                                            </button>
                                        </div>
                                        <div class="col-6">
                                            <button type="submit" class="btn-buy btn-3" name="action" value="buy-now">
                                                <span>Mua ngay</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* <!-- Địa chỉ user --> */}
                            <div class="info-address">
                                <h2 class="title">Thông tin vận chuyển</h2>
                                <p class="address">
                                    <span>Giao hàng đến </span>
                                    <span>

                                    </span>
                                </p>
                            </div>
                        </div>
                        {/* <!-- End Thông tin sản phẩm và button mua và thêm vào giỏ hàng --> */}

                    </div>
                </div>
            </section>
            {/* <!-- end  product detail--> */}

            {/* <!-- Nội dung chi tiết và mô tả --> */}
            <section class="content-detail-and-reviews">
                <div class="container">
                    <div class="inner-wrap">
                        {/* <!-- head title--> */}
                        <div class="tab-list">
                            <ul>
                                <li class="tab-item desc-tab active">
                                    <span>Mô tả</span>
                                </li>
                                <li class="tab-item detail-info-tab">
                                    <span>Thông tin chi tiết</span>
                                </li>
                            </ul>
                        </div>
                        {/* <!-- description --> */}
                        <div class="description-content">
                            <h3 class="name-product">
                            </h3>
                            <p class="desc">
                            </p>
                        </div>
                        {/* <!-- Nội dung chi tiết --> */}
                        <div class="product-detail-content">
                            <div class="container-850">
                                <table class="content-list">
                                    <tbody>
                                        <tr class="content-item">
                                            <th class="title">Tác giả</th>
                                            <td class="value"></td>
                                        </tr>
                                        <tr class="content-item">
                                            <th class="title">NXB</th>
                                            <td class="value"></td>
                                        </tr>
                                        <tr class="content-item">
                                            <th class="title">Năm xuất bản</th>
                                            <td class="value"></td>
                                        </tr>
                                        <tr class="content-item">
                                            <th class="title">Ngôn ngữ</th>
                                            <td class="value"></td>
                                        </tr>
                                        <tr class="content-item">
                                            <th class="title">Số trang</th>
                                            <td class="value"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- end Nội dung chi tiết và mô tả --> */}

            {/* <!-- review --> */}
            <section class="reviews">
                <div class="container">
                    <div class="reviews-content">
                        <div class="head-review">
                            {/* <!-- Title --> */}
                            <div class="head-title">
                                <h2 class="title">Đánh giá sản phẩm</h2>
                            </div>
                            {/* <!-- end title --> */}
                            {/* <!-- Hiển thị điểm đánh giá và form đánh giá  --> */}
                            <div class="row align-items-center head-review-inner">
                                {/* <!-- Hiển thị điểm đánh giá --> */}
                                <div class="col-xl-6 offset-xl-1 col-lg-7 col-12">
                                    <div class="rating-tab row">
                                        <div class="number col-lg-3 col-sm-4">
                                            {/* <!-- Điểm rating trung bình --> */}
                                            <div class="rating-on-5">
                                                <span></span>
                                            </div>
                                            {/* <!-- Sao của điểm rating trung bình --> */}
                                            <div class="star-icon text-center">
                                                <i class="fa-regular fa-star"></i>
                                                <i class="fa-regular fa-star"></i>
                                                <i class="fa-regular fa-star"></i>
                                                <i class="fa-regular fa-star"></i>
                                                <i class="fa-regular fa-star"></i>
                                                <div class="full-state" >
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                </div>
                                            </div>
                                            {/* <!-- Số lượng đánh giá --> */}
                                            <div class="count-review">
                                                <span></span>
                                            </div>
                                        </div>
                                        {/* <!-- Hiển thị sao từ 1 -> 5 --> */}
                                        <div class="all-star col-lg-9 col-sm-8">
                                            <div class="all-star-item">
                                                <div class="star-icon text-center">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                </div>
                                                <div class="process">
                                                    <div class="percent-process">
                                                    </div>
                                                </div>
                                                <div class="count-number-review-star">
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div class="all-star-item">
                                                <div class="star-icon text-center">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                </div>
                                                <div class="process">
                                                    <div class="percent-process">

                                                    </div>
                                                </div>
                                                <div class="count-number-review-star">
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div class="all-star-item">
                                                <div class="star-icon text-center">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                </div>
                                                <div class="process">
                                                    <div class="percent-process" >
                                                    </div>
                                                </div>
                                                <div class="count-number-review-star">
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div class="all-star-item">
                                                <div class="star-icon text-center">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                </div>
                                                <div class="process">
                                                    <div class="percent-process" >

                                                    </div>
                                                </div>
                                                <div class="count-number-review-star">
                                                    <span></span>
                                                </div>
                                            </div>
                                            <div class="all-star-item">
                                                <div class="star-icon text-center">
                                                    <i class="fa-solid fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                </div>
                                                <div class="process">
                                                    <div class="percent-process" >

                                                    </div>
                                                </div>
                                                <div class="count-number-review-star">
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End hiển thị sao từ 1 -> 5 --> */}
                                    </div>
                                </div>
                                {/* <!-- End hiển thị điểm đánh giá --> */}

                                {/* <!-- Form đánh giá --> */}
                                <div class="col-xl-5 col-lg-5 col-12">
                                    <div class="write-review">
                                        {/* <!-- Button viết đánh giá --> */}
                                        <div class="row pt-3 justify-content-center">
                                            <div class="col-lg-7 col-sm-6 col-7">
                                                <button type="button" class="btn-write-review btn btn-2"
                                                    data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                    <span>
                                                        <i class="fa-solid fa-pen"></i>
                                                    </span>
                                                    <span>Viết đánh giá</span>
                                                </button>
                                            </div>
                                        </div>
                                        {/* <!-- End button viết đánh giá --> */}
                                        {/* <!-- Form --> */}
                                        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static"
                                            data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel"
                                            aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered">
                                                <div class="modal-content p-4">
                                                    {/* <!-- title --> */}
                                                    <div class="modal-header border-0">
                                                        <div class="modal-title fs-5 title-form" id="staticBackdropLabel">
                                                            <h2>Viết đánh giá</h2>
                                                        </div>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                            aria-label="Close"></button>
                                                    </div>
                                                    {/* <!-- Body --> */}
                                                    <div class="modal-body">
                                                        <form action="/review/store" class="your-rating" method="post">
                                                            {/* <!-- Sao --> */}
                                                            <div class="form-group mt-4">
                                                                <div class="rate ">
                                                                    <input type="radio" id="star5" name="rate" value="5" checked />
                                                                    <label for="star5" title="text">5 stars</label>
                                                                    <input type="radio" id="star4" name="rate" value="4" />
                                                                    <label for="star4" title="text">4 stars</label>
                                                                    <input type="radio" id="star3" name="rate" value="3" />
                                                                    <label for="star3" title="text">3 stars</label>
                                                                    <input type="radio" id="star2" name="rate" value="2" />
                                                                    <label for="star2" title="text">2 stars</label>
                                                                    <input type="radio" id="star1" name="rate" value="1" required />
                                                                    <label for="star1" title="text">1 star</label>
                                                                </div>
                                                            </div>
                                                            {/* <!-- Lấy book id --> */}
                                                            <input type="hidden" name="bookId" value="<?= html_escape($book->id) ?>" />
                                                            {/* <!-- sesskey --> */}
                                                            <input type="hidden" value="<?= $_SESSION['sesskey'] ?>" name="sesskey" />
                                                            {/* <!-- Text area điền đánh giá --> */}
                                                            <div class="form-group mt-2">
                                                                <textarea rows="6" name="content" id="" class="input-review"
                                                                    placeholder="Đánh giá của bạn" required></textarea>
                                                            </div>
                                                            {/* <!-- Button đăng và hủy --> */}
                                                            <div class="modal-footer d-flex justify-content-end border-0">
                                                                <button type="button"
                                                                    class="btn d-flex align-items-center justify-content-center gap-2 btn-close-color"
                                                                    data-bs-dismiss="modal">
                                                                    <span>Hủy bỏ</span>
                                                                </button>
                                                                <button class="btn-review btn-3" type="submit">
                                                                    Đăng
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End form --> */}
                                    </div>
                                </div>
                                {/* <!-- End form đánh giá --> */}
                            </div>
                        </div>
                        {/* <!-- End hiển thị điểm đánh giá và form đánh giá  --> */}

                        {/* <!-- review --> */}
                        <div class="review-list">

                            <div class="notification-non-review">
                                <i class="fa-solid fa-inbox"></i>
                                <span>Chưa có đánh giá nào</span>
                            </div>
                        </div>
                        {/* <!-- end review --> */}

                    </div>
                </div>
            </section>
            {/* <!-- end review --> */}

            {/* <!-- related product --> */}
            <section class="related-product">
                <div class="container">
                    <div class="inner-wrap">
                        {/* <!-- Title --> */}
                        <div class="head-title">
                            <h2 class="title">Sản phẩm liên quan</h2>
                        </div>
                        {/* <!-- end title --> */}
                        <div class="products-list">
                            {/* <!-- Hiển thị sách --> */}
                            <div class="row products">
                                <div class="col-xl-2 col-md-3 col-6 product">
                                    <a href="/product/<?= html_escape($book->id) ?>" class="card">
                                        <div class="card-img">
                                            <img src="/assets/img/book/<?= html_escape($book->images[0]) ?>" class="card-img-top"
                                                alt="<?= html_escape($book->name) ?>" />
                                        </div>
                                        <div class="card-body content">
                                            <div class="title">
                                                <h3></h3>
                                            </div>
                                            <div class="price-product">
                                                <div class="current-price">
                                                    <span></span>
                                                    <sup>đ</sup>
                                                </div>
                                            </div>
                                            <div class="reviews">
                                                <div class="star-icon text-center">
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <i class="fa-regular fa-star"></i>
                                                    <div class="full-state" >
                                                        <i class="fa-solid fa-star"></i>
                                                        <i class="fa-solid fa-star"></i>
                                                        <i class="fa-solid fa-star"></i>
                                                        <i class="fa-solid fa-star"></i>
                                                        <i class="fa-solid fa-star"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            {/* <!-- End hiển thị sách --> */}
                            {/* <!-- pagination --> */}
                            <nav class="nav-pagination" aria-label="Page navigation">
                                <ul class="pagination">
                                    <li class="page-item<?= $paginator->getPrevPage() ? '' : ' disabled' ?>">
                                        <a class="page-link"
                                            href="?page=<?= html_escape($paginator->getPrevPage()) ?>&limit=12<?= $queryString ? '&' . $queryString : '' ?>"
                                            aria-label="Previous">
                                            <i aria-hidden="true" class="fa-solid fa-chevron-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item<?= $paginator->currentPage == $page ? ' active' : '' ?>">
                                        <a class="page-link" href="?page=<?= html_escape($page) ?>&limit=12<?= $queryString ? '&' . $queryString : '' ?>">
                                        </a>
                                    </li>
                                    <li class="page-item<?= $paginator->getNextPage() ? '' : ' disabled' ?>">
                                        <a class="page-link"
                                            href="?page=<?= html_escape($paginator->getNextPage()) ?>&limit=12<?= $queryString ? '&' . $queryString : '' ?>"
                                            aria-label="Next">
                                            <i aria-hidden="true" class="fa-solid fa-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                            {/* <!-- end pagination --> */}
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- end related product --> */}
        </>
    );
}