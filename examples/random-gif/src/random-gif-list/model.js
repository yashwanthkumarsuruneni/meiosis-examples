import { mergeIntoOne } from "../util";
import { randomGif } from "../random-gif";
import { randomGifListActions } from "../view/events/random-gif-list";

export const initialModel = () => ({
  randomGifIds: [],
  randomGifsById: {}
});

const add = randomGifListActions.add.map(() => model => {
  const randomGifModel = randomGif.initialModel();
  model.randomGifIds.push(randomGifModel.id);
  model.randomGifsById[randomGifModel.id] = randomGifModel;
  return model;
});

const remove = randomGifListActions.remove.map(id => model => {
  delete model.randomGifsById[id];
  model.randomGifIds.splice(model.randomGifIds.indexOf(id), 1);
  return model;
});

const update = randomGif.modelChanges.map(modelChange => model => {
  model.randomGifIds.forEach(id => modelChange(model.randomGifsById[id]));
  return model;
});

export const modelChanges = mergeIntoOne([add, remove, update]);
