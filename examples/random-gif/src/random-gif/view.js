import m from "mithril";
import { randomGifIntents } from "./actions";
import { imgsrc } from "./index";

export const randomGifView = model =>
  m("div", [
    m("span", "Tag:"),
    m("input[type=text]", { value: model.tag, onkeyup: randomGifIntents.editTag(model.id) }),
    m("button.btn.btn-xs.btn-default", { onclick: randomGifIntents.newGif(model.id, model.tag) }, "Random Gif"),
    m("div", [ m("img", { width: 200, height: 200, src: imgsrc(model) }) ])
  ]);