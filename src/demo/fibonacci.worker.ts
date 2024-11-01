import {fibonacci, type MessageType} from "./fibonacci.shared";

self.addEventListener('message', function (e: MessageEvent<MessageType>) {
  for (let i = 0; i < e.data.taskNumber; i++) {
    fibonacci(e.data.fibonacciNumber);
  }
  self.postMessage('done');
  self.close();
})

export default {}

