
const products = [
    {
        brand: "SKINTIFIC",
        name: "All Day Protect Tinted Serum Sunscreen SPF 50+ PA++++ 0NC PORCELAIN 30g",
        price: 120000,
        type: "Tinted",
        kind: "Chemical",
        desc: "Tinted Sunscreen SPF 50+ PA++++ yang memberikan coverage sempurna dengan finish soft-glow. Dilengkapi dengan Dual UV Defense System untuk perlindungan optimal terhadap sinar UVA dan UVB.",
        tone: "white"
    },
    {
        brand: "Wardah",
        name: "UV Shield Airy Smooth Sunscreen Serum SPF 50 PA++++",
        price: 60000,
        type: "Chemical",
        kind: "Chemical",
        desc: "Sunscreen serum ringan dengan tekstur airy smooth untuk pemakaian sehari-hari.",
        tone: "teal"
    },
    {
        brand: "Azarine",
        name: "Hydrasoothe Sunscreen Gel SPF 45 PA++++",
        price: 65000,
        type: "Physical",
        kind: "Physical",
        desc: "Gel sunscreen ringan yang membantu melindungi kulit dari paparan sinar matahari.",
        tone: "teal"
    },
    {
        brand: "SKINTIFIC",
        name: "Tone Up Sunscreen SPF 50+ PA++++",
        price: 99000,
        type: "Tinted",
        kind: "Physical",
        desc: "Sunscreen tone-up dengan hasil akhir cerah natural.",
        tone: "white"
    }
];

let filter = "Semua";
let selected = 0;
let lastScreen = "products";
let photoUrl = null;
let stream = null;
let cart = 0;


// NAVIGASI HALAMAN

function go(id) {

    const target = document.getElementById(id);

    if (!target) return;

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.toggle("active", screen.id === id);
    });

    document.querySelectorAll(".nav button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === id
        );
    });

    if (id === "products") {
        renderProducts();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// FORMAT HARGA

function rupiah(number) {
    return "Rp " + number.toLocaleString("id-ID");
}


// MEMBUAT ILUSTRASI PRODUK

function bottle(product) {

    return `
        <div class="bottle ${product.tone === 'teal' ? 'teal' : ''}">
            <span class="brandname">${product.brand}</span>

            <span class="bottletext">
                ${product.type.toUpperCase()}
                <br>
                SUNSCREEN
                <br>
                SPF 50+
            </span>
        </div>
    `;
}


// MENAMPILKAN PRODUK

function renderProducts() {

    const search = document
        .getElementById("search")
        .value
        .toLowerCase();

    const list = products
        .map((product, index) => ({
            ...product,
            index
        }))
        .filter(product => {

            const matchFilter =
                filter === "Semua" ||
                product.type === filter ||
                product.kind === filter;

            const matchSearch =
                `${product.brand} ${product.name}`
                .toLowerCase()
                .includes(search);

            return matchFilter && matchSearch;
        });

    const container = document.getElementById("productList");

    if (list.length === 0) {

        container.innerHTML = `
            <div class="empty">
                Produk tidak ditemukan.
                Coba kata kunci lain.
            </div>
        `;

        return;
    }

    container.innerHTML = list.map(product => `

        <article class="product-card">

            <div>
                ${bottle(product)}
            </div>

            <div class="product-info">

                <strong>
                    ${product.brand}
                    <br>
                    ${product.name}
                </strong>

                <div class="price">
                    ${rupiah(product.price)}
                </div>

                <button
                    class="small-btn"
                    onclick="openProduct(${product.index})"
                >
                    Lihat Detail →
                </button>

            </div>

        </article>

    `).join("");
}


// FILTER PRODUK

function setFilter(element) {

    filter = element.dataset.filter;

    document.querySelectorAll(".chip").forEach(chip => {
        chip.classList.toggle("active", chip === element);
    });

    renderProducts();
}


function toggleFilters() {

    document.getElementById("filters").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    showToast("Pilih kategori sunscreen untuk memfilter produk");
}


// DETAIL PRODUK

function openProduct(index) {

    selected = index;

    lastScreen = document.querySelector(".screen.active").id;

    const product = products[index];

    document.getElementById("detailName").textContent =
        product.brand + " " + product.name;

    document.getElementById("detailPrice").textContent =
        rupiah(product.price);

    document.getElementById("detailDesc").textContent =
        product.desc;

    document.getElementById("cartCount").textContent = cart;

    go("detail");
}


// TAMBAH KERANJANG

function addCart() {

    cart++;

    document.getElementById("cartCount").textContent = cart;

    document.getElementById("cartMessage").textContent =
        "Produk berhasil ditambahkan ke keranjang!";

    showToast("Berhasil ditambahkan ke keranjang");
}


// BELI PRODUK

function buyNow() {

    showToast(
        "Ini masih prototipe. Fitur checkout perlu dihubungkan ke toko dan pembayaran."
    );

}


// KRITIK DAN SARAN

function showReviews() {

    document.getElementById("reviewModal")
        .classList.add("show");

}


function closeReviews() {

    document.getElementById("reviewModal")
        .classList.remove("show");

}


function submitReview() {

    const value = document
        .getElementById("reviewText")
        .value
        .trim();

    if (!value) {

        showToast("Tulis kritik atau saran terlebih dahulu");

        return;
    }

    closeReviews();

    document.getElementById("reviewText").value = "";

    showToast("Terima kasih atas masukan kamu!");

}


// UPLOAD FOTO

function loadPhoto(event) {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        showToast("Pilih file gambar JPG atau PNG");

        return;
    }

    if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
    }

    photoUrl = URL.createObjectURL(file);

    const image = document.getElementById("preview");

    image.src = photoUrl;

    image.style.display = "block";

    document.querySelector(".camera-icon").style.display = "none";

    showToast("Foto berhasil dipilih");

}


// MEMBUKA KAMERA

async function openCamera() {

    if (!navigator.mediaDevices?.getUserMedia) {

        showToast("Kamera tidak didukung. Gunakan upload foto.");

        return;
    }

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });

        document.getElementById("video").srcObject = stream;

        document.getElementById("cameraModal")
            .classList.add("show");

    } catch (error) {

        showToast(
            "Kamera tidak dapat diakses. Izinkan akses kamera atau unggah foto."
        );

    }

}


// MENUTUP KAMERA

function closeCamera() {

    document.getElementById("cameraModal")
        .classList.remove("show");

    if (stream) {

        stream.getTracks().forEach(track => track.stop());

        stream = null;

    }

}


// MENGAMBIL FOTO DARI KAMERA

function capture() {

    const video = document.getElementById("video");

    if (!video.videoWidth) {
        showToast("Kamera belum siap. Coba beberapa saat lagi.");
        return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    canvas.toBlob(blob => {

        if (!blob) return;

        if (photoUrl) {
            URL.revokeObjectURL(photoUrl);
        }

        photoUrl = URL.createObjectURL(blob);

        const image = document.getElementById("preview");

        image.src = photoUrl;

        image.style.display = "block";

        document.querySelector(".camera-icon").style.display = "none";

        closeCamera();

        showToast("Foto berhasil diambil");

    });

}


// ANALISIS WARNA KULIT SEDERHANA

function analyze() {

    if (!photoUrl) {

        showToast(
            "Unggah foto atau ambil foto dengan kamera terlebih dahulu"
        );

        return;
    }

    const image = new Image();

    image.onload = () => {

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");

        canvas.width = 80;
        canvas.height = 80;

        context.drawImage(image, 0, 0, 80, 80);

        const pixels = context.getImageData(
            20, 15, 40, 50
        ).data;

        let red = 0;
        let green = 0;
        let blue = 0;
        let count = 0;

        for (let i = 0; i < pixels.length; i += 4) {

            red += pixels[i];
            green += pixels[i + 1];
            blue += pixels[i + 2];

            count++;

        }

        const average =
            (red + green + blue) / (3 * count);

        let skinTone;

        if (average > 190) {

            skinTone = "Light";

        } else if (average > 135) {

            skinTone = "Medium";

        } else {

            skinTone = "Tan / Deep";

        }

        document.getElementById("tone").textContent = skinTone;

        document.getElementById("resultPhoto").src = photoUrl;

        go("result");

    };

    image.src = photoUrl;

}


// NOTIFIKASI

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.style.display = "block";

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.style.display = "none";

    }, 2800);

}


// MENJALANKAN WEBSITE

renderProducts();
