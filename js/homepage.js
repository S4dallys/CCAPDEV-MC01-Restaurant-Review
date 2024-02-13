const url = window.location.search;
const urlParams = new URLSearchParams(url);

const filter = urlParams.get("filter");

if (filter != null && filter !== "") {
    document.getElementById("search-bar").value = filter;

    const ul = document.getElementById("p1-restaurants-list");
    const li = ul.getElementsByTagName("li");
    let name;

    for (let i = 0; i < li.length; i++) {
        name = li[i].getElementsByClassName("p1-resto-name")[0].innerText;
        if (name.toLowerCase().indexOf(filter) == -1) {
            li[i].style.display = "none";
        }
    }
}
