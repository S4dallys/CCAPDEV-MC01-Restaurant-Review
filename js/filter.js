const url = window.location.search;
const urlParams = new URLSearchParams(url);

let filter = urlParams.get("filter");
let rvfilter = urlParams.get("rv-filter");

if (filter != null && filter !== "") {
    filter = filter.toLowerCase();
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

if (rvfilter != null && rvfilter !== "") {
    rvfilter = rvfilter.toLowerCase();
    document.getElementById("search-bar").value = rvfilter;

    const ul = document.getElementById("pro-review-ul");
    const li = ul.getElementsByClassName("pro-review-li");
    let title, content;

    for (let i = 0; i < li.length; i++) {
        title = li[i].getElementsByClassName("pro-review-title")[0].innerText;
        content = li[i].getElementsByClassName("pro-review-text")[0].innerHTML;

        if (title.toLowerCase().indexOf(rvfilter) == -1 && content.toLowerCase().indexOf(rvfilter) == -1) {
            li[i].style.display = "none";
        }
    }
}
