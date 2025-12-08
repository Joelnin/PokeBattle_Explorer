function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class TrainerData {
  constructor() {
    this.path = `../json/trainers.json`;
  }
  async getData() {
    const res = await fetch(this.path);
    const data = await convertToJson(res);
    return data;
  }
  async findTrainertById(id) {
    const trainers = await this.getData();
    return trainers.find((item) => item.Id === id);
  }
}
