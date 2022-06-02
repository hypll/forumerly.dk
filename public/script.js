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

const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

fetch("/api/categories", {
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

// function validdation(this) {
//     if (this.value === "") {
//        document.getElementById("commentSubmit").disabled = true;
//     } else {
//         document.getElementById("commentSubmit").disabled = false;
//     }
// }
