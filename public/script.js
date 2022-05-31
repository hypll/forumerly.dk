function r(url) {
    window.location.href = url;
}

if (window.location.pathname === "/forum") {
    document.getElementById("home").classList.add("active");
} else if (window.location.pathname === "/forum/new") {
    document.getElementById("new").classList.add("active");
}

setTimeout(function () {
    document.querySelector(".alert-remove").remove();
}, 5000);

fetch("http://localhost:8080/api/categories", {
    method: "GET",
})
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var categories = data.categories;

        const kategorierDiv = document.getElementById("kategorier");

        kategorierDiv.innerHTML = categories.map((kategori) => {
            return `
        <div class="col-md-4" key="${kategori.id}" onclick="r('/forum/${kategori.url}')">
            <div class="card kategori">
                <div class="card-body">
              <h5 class="card-title">${kategori.name}</h5>
                <p class="card-text text-muted">
                ${kategori.description}
             </p>
            </div>
          </div>
        </div>
    `;
        });
    });
