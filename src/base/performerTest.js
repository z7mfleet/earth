let t0 = performance.now();
  let count = 10;
  let len = 10000;
  for (let i = 0; i < count; i++){
    let arr = new Array(len).fill(1).map((v, i) => i);
    arr.splice(50, 0, 50);
  }
  let t1 = performance.now();
  console.log(t1 - t0, 'ms');//1.2ms

  let t2 = performance.now();
  for (let i = 0; i < count; i++){
    let arr = new Array(len).fill(1).map((v, i) => i);
    arr.push(50);
    arr.sort((a, b) => a - b);
  }
  let t3 = performance.now();
  console.log(t3 - t2, 'ms');//2.6ms