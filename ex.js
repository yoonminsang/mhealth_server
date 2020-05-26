var myFirstPromise = new Promise((resolve, reject) => {
  // 성공이면 resolve, 실패면 reject
  // 비동기 함수 setTimeout을 사용
  setTimeout(function () {
    resolve("Success!");
  }, 250);
});
myFirstPromise.then((message) => {
  console.log("Yay! " + message);
});

var myFirstPromise = new Promise((resolve, reject) => {
  // 성공이면 resolve, 실패면 reject
  // 비동기 함수 setTimeout을 사용
  setTimeout(function () {
    reject("FAIL!");
  }, 250);
});
myFirstPromise.then((error) => {
  console.log("NO! " + error);
});

// function task(resolve, reject) {
//   console.log("task start");
//   setTimeout(function () {
//     console.log("task end");
//     resolve("task success");
//   }, 300);
// }
// function fullfilled(result) {
//   console.log("fullfilled : ", result);
// }
// function rejected(err) {
//   console.log("rejected : ", err);
// }
// new Promise(task).then(fullfilled, rejected);

// var p1 = new Promise((resolve, reject) => {
//   // eslint-disable-line no-unused-vars
//   setTimeout(() => {
//     reject("fail promise");
//   }, 1000);
// });

// p1.catch((error) => {
//   console.log(error);
// });

// var p1 = new Promise((resolve, reject) => {
//   // eslint-disable-line no-unused-vars
//   setTimeout(() => {
//     reject(new Error("Promise failed"));
//   }, 1000);
// });

// p1.then((error) => {
//   console.log(error);
// });
