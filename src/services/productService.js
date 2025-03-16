export async function createProduct(productRequest) {
    var promise = fetch('http://localhost:8080/product', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productRequest)
    }).then(data => data.json());
    return promise;
}

export async function createProductThumbnail(thumbnailRequest, productId) {
    const formData = new FormData();
    formData.append("file", thumbnailRequest);
    formData.append("productId", productId);
    var promise = fetch('http://localhost:8080/product/thumbnail', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    }).then(data => data.json());
    return promise;
}

export async function createProductImages(imageRequest, productId) {
    const formData = new FormData();
    imageRequest.forEach(element => {
        formData.append("files", element);
    });
    formData.append("productId", productId);
    var promise = fetch('http://localhost:8080/product/images', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
    }).then(data => data.json());
    return promise;
}

export async function searchProduct(params) {
    console.log("param:", params)
    var url = 'http://localhost:8080/product/search?';
    if (params.name) {
        url += 'name=' + params.name + "&";
    }
    if (params.categoryId) {
        url += 'categoryId=' + params.categoryId + "&";
    }
    if (params.categoryName) {
        url += "categoryName=" + params.categoryName + "&";
    }
    if (params.priceFrom) {
        url += 'priceFrom=' + params.priceFrom + "&";
    }
    if (params.priceTo) {
        url += "priceTo=" + params.priceTo + "&";
    }
    if (params.currentPage) {
        url += "page=" + params.currentPage + "&";
    }
    if (params.pageSize) {
        url += "size=" + params.pageSize;
    }
    console.log(url)
    var promise = fetch(url, {
        method: 'GET'
    }).then(data => data.json());
    return promise;
}

export async function deleteImage(imageId) {
    var promise = fetch('http://localhost:8080/image/' + imageId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    });
    return promise;
}

export async function deleteAttribute(attributeId) {
    var promise = fetch('http://localhost:8080/product/attribute/' + attributeId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    });
    return promise;
}

export async function deleteVariant(variantId) {
    var promise = fetch('http://localhost:8080/product/variant/' + variantId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    });
    return promise;
}

export async function deleteProduct(productId) {
    var promise = fetch('http://localhost:8080/product/' + productId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    });
    return promise;
}

export async function findById(id) {
    var promise = fetch('http://localhost:8080/product/get/' + id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    }).then(data => data.json());
    return promise;
}