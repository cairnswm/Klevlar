function onLoaded() {
    let Pages = new pageManager("klevlar");
    Pages.show();
    let Menu = new Page("menu")
        .addHeader("KLEVLAR")
        .addElem(new Container()
            .addText("Page 1").on("click",()=> { Pages.setPage("page1"); }).class("nav-item")
            .addText("Page 2").on("click",()=> { Pages.setPage("page2"); }).class("nav-item")
        ).class("nav")
        .show();
}