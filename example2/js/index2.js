function onLoaded() {
    async function showPage(obj) {
        let divs = document.querySelectorAll(".content");
        divs.forEach(div => { div.style.display = "none" });
        
        document.querySelector("#main").classList.remove("no-small");
        document.querySelector('#leftbar').classList.add("no-small");
        obj.show();
        showHide(".nav",false);
    }
    let Example1 = new Example1Page("klevlar");
    Example1.show();
}