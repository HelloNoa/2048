class map {
  constructor(x, y) {
    this.api = 'localhost:3000';
    this.map = [];
    this.x = x;
    this.y = y;
    this.score = 0;
    this.click = false;
    for (let i = 0; i < y; i++) {
      this.map.push([]);
      for (let j = 0; j < x; j++) {
        this.map[i].push(new block(0));

        let el = this.map[i][j].getel();
        let subel = this.map[i][j].getSubel();
        el.style.display = 'none';
        subel.innerText = this.map[i][j].val;
        this.map[i][j].setel(el);
        this.map[i][j].setSubel(subel)
        el.appendChild(subel);
        document.getElementById('map').appendChild(el);
      }
    }
    document.querySelectorAll('#buttonArea div').forEach(e => {
      e.onclick = () => {
        if (!this.click) {
          switch (e.className) {
            case 'left':
              this.move(0);
              break;
            case 'right':
              this.move(1);
              break;
            case 'top':
              this.move(3);
              break;
            case 'bottom':
              this.move(2);
              break;
          }
        }
      }
    })
    window.addEventListener("keydown", (e) => {
      if (!this.click) {
        if (e) {
          switch (e.key) {
            case 'w':
            case 'W':
            case 'ㅈ':
              this.click = true;
              this.move(3);
              break;
            case 'a':
            case 'A':
            case 'ㅁ':
              this.click = true;
              this.move(0);
              break;
            case 's':
            case 'S':
            case 'ㄴ':
              this.click = true;
              this.move(2);
              break;
            case 'd':
            case 'D':
            case 'ㅇ':
              this.click = true;
              this.move(1);
              break;
            default:
              break;
          }
        }
      }
    }, false);

    !this.setRandomBlock() && alert('GAMEOVER');

    (async () => {
      await (() => {
        0
      })
    })()
    document.getElementById('leaderBoard').querySelectorAll('li').forEach((e, idx) => {
      e.querySelector('.content').style.backgroundColor = this.color(Math.pow(2, idx))
      e.querySelector('.bg').style.borderTopColor = this.color(Math.pow(2, idx), true)

    });

    document.querySelector('a.leaderBoard_btn').onclick = () => {
      document.querySelector('.bg_popup_wrap').style.display = 'block';
    }

    document.querySelector('.leaderBoard_wrap a.cancle_btn').onclick = () => {
      document.querySelector('.bg_popup_wrap').style.display = 'none';
    }
  }

  getRandomBlockIdx() {
    let range = [];
    for (let i = 0; i < this.y; i++) {
      for (let j = 0; j < this.x; j++) {
        this.map[i][j].val == 0 && range.push({ x: j, y: i })
      }
    }
    //0 <= x <= 24
    return range.length > 0 ? range[Math.floor(Math.random() * (range.length))] : false;
  }

  setRandomBlock() {
    let block = this.getRandomBlockIdx();
    if (!(block === false)) {
      this.map[block.y][block.x].val = (Math.floor(Math.random() * 2) + 1) * 2;
      this.map[block.y][block.x].readyblock = true;

      let el = this.map[block.y][block.x].getel();
      let subel = this.map[block.y][block.x].getSubel();
      el.style.transform = `translate(${block.x * 100}% ,${block.y * 100}%)`;
      subel.innerText = this.map[block.y][block.x].val;
      subel.style.backgroundColor = this.color(this.map[block.y][block.x].val);
      this.map[block.y][block.x].setel(el);
      this.map[block.y][block.x].setSubel(subel)
      el.appendChild(subel);
      el.style.display = 'block';
      return true;
    } else {
      //gameOver
      return false;
    }
  }

  getBlankSpace(e, ax, ay) {
    switch (e) {
      case 0://left
        for (let x = 0; x <= ax; x++) {
          if (this.map[ay][x].val === 0) {
            return x;
          }
        }
        break;
      case 1://right
        for (let x = this.x - 1; x >= ax; x--) {
          if (this.map[ay][x].val === 0) {
            return x;
          }
        }
        break;
      case 2://down
        for (let y = this.y - 1; y >= ay; y--) {
          if (this.map[y][ax].val === 0) {
            return y;
          }
        }
        break;
      case 3://up
        for (let y = 0; y <= ay; y++) {
          if (this.map[y][ax].val === 0) {
            return y;
          }
        }
        break;
    }
    return false;
  }

  clearDone() {
    this.map.forEach(e => {
      e.forEach(el => {
        el.done = false;
      })
    })
    this.stack = [];
  }

  color(n, dark = false) {
    let c = 0;
    while (1) {
      if (Math.floor(n / 2) > 0) {
        n /= 2;
        c++;
      } else {
        n /= 2;
        c++;
        break;
      }
    }
    var r = 255 - ((c * 25) % 255);
    var g = 255 - ((c * 12) % 255);
    var b = 255 - ((c * 32) % 255);
    if (dark) {
      let d = 0.5;
      return `rgb(${r * d} ${g * d} ${b * d})`
    } else {
      return `rgb(${r} ${g} ${b})`
    }
  }

  drawView() {
    if (this.stack.length === 0) return false;
    this.stack.forEach(e => {
      let prevtarget = this.map[e.ay][e.ax];
      let target = this.map[e.by][e.bx];

      target.subel.innerText = prevtarget.subel.innerText;

      target.el.style.transform = `translate(${e.ax * 100}%,${e.ay * 100}%)`;
      target.subel.style.backgroundColor = this.color(+target.subel.innerText)
      prevtarget.el.style.display = 'none';
      target.el.style.display = 'block';
      target.el.animate([
        // keyframes
        { transform: `translate(${e.ax * 100}%,${e.ay * 100}%)` },
        { transform: `translate(${e.bx * 100}%,${e.by * 100}%)` }
      ], {
        // timing options
        duration: 100,
        iterations: 1,
        fill: 'forwards',
      });
      setTimeout(() => {
        target.subel.style.backgroundColor = this.color(target.val);
        target.subel.innerText = target.val;
      }, 100);
    });
    setTimeout(() => {
      document.getElementById('score').innerText = this.score;
    }, 0);
    return true;
  }

  move(e) {
    this.clearDone();
    switch (e) {
      case 0://a : left
        for (let y = 0; y < this.y; y++) {
          for (let x = 0; x < this.x - 1; x++) {
            if (this.map[y][x].val === 0) continue
            for (let dx = x + 1; dx < this.x; dx++) {
              if (this.map[y][dx].val === 0 && dx !== this.x - 1) continue
              if (this.map[y][x].val == this.map[y][dx].val && !this.map[y][x].done && !this.map[y][dx].done && this.map[y][x].val !== 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[y][target].val = this.map[y][x].val + this.map[y][dx].val;
                  this.map[y][x].val = 0;
                  this.map[y][dx].val = 0;
                  this.map[y][target].done = true;
                  this.stack.push({ ax: x, ay: y, bx: target, by: y });
                  this.stack.push({ ax: dx, ay: y, bx: target, by: y });
                } else {
                  this.map[y][x].val += this.map[y][dx].val;
                  this.map[y][dx].val = 0;
                  this.map[y][x].done = true;
                  this.stack.push({ ax: dx, ay: y, bx: x, by: y });
                }
                this.score += this.map[y][x].val + this.map[y][dx].val;
                break;
              } else if (!this.map[y][dx].done && this.map[y][dx].val !== 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[y][target].val = this.map[y][x].val;
                  this.map[y][x].val = 0;
                  this.map[y][target].done = true;
                  this.stack.push({ ax: x, ay: y, bx: target, by: y });
                } else {
                  this.map[y][x].done = true;
                }
                break;
              } else if (dx === this.x - 1) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[y][target].val = this.map[y][x].val;
                  this.map[y][x].val = 0;
                  this.map[y][target].done = true;
                  this.stack.push({ ax: x, ay: y, bx: target, by: y });
                } else {
                  this.map[y][x].done = true;
                }
                break;

              }
            }
          }
          if (!(this.map[y][this.x - 1].val === 0)) {
            let target = this.getBlankSpace(e, this.x - 1, y);
            if (!(target === false)) {
              this.map[y][target].val = this.map[y][this.x - 1].val;
              this.map[y][this.x - 1].val = 0;
              this.map[y][target].done = true;
              this.stack.push({ ax: this.x - 1, ay: y, bx: target, by: y });
            } else {
              this.map[y][this.x - 1].done = true;
            }
          }
        }
        break;
      case 1://d : right
        for (let y = 0; y < this.y; y++) {
          for (let x = this.x - 1; x > 0; x--) {
            if (this.map[y][x].val === 0) continue
            for (let dx = x - 1; dx >= 0; dx--) {
              if (this.map[y][dx].val === 0 && dx !== 0) continue
              if (this.map[y][x].val == this.map[y][dx].val && !this.map[y][x].done && !this.map[y][dx].done && this.map[y][x].val !== 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[y][target].val = this.map[y][x].val + this.map[y][dx].val;
                  this.map[y][x].val = 0;
                  this.map[y][dx].val = 0;
                  this.map[y][target].done = true;
                  this.stack.push({ ax: x, ay: y, bx: target, by: y });
                  this.stack.push({ ax: dx, ay: y, bx: target, by: y });
                } else {
                  this.map[y][x].val += this.map[y][dx].val;
                  this.map[y][dx].val = 0;
                  this.map[y][x].done = true;
                  this.stack.push({ ax: dx, ay: y, bx: x, by: y });
                }
                this.score += this.map[y][x].val + this.map[y][dx].val;
                break;
              } else if (!this.map[y][dx].done && this.map[y][dx].val !== 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[y][target].val = this.map[y][x].val;
                  this.map[y][x].val = 0;
                  this.map[y][target].done = true;
                  this.stack.push({ ax: x, ay: y, bx: target, by: y });
                } else {
                  this.map[y][x].done = true;
                }
                break;
              } else if (dx === 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[y][target].val = this.map[y][x].val;
                  this.map[y][x].val = 0;
                  this.map[y][target].done = true;
                  this.stack.push({ ax: x, ay: y, bx: target, by: y });
                } else {
                  this.map[y][x].done = true;
                }
                break;

              }
            }
          }
          if (!(this.map[y][0].val === 0)) {
            let target = this.getBlankSpace(e, 0, y);
            if (!(target === false)) {
              this.map[y][target].val = this.map[y][0].val;
              this.map[y][0].val = 0;
              this.map[y][target].done = true;
              this.stack.push({ ax: 0, ay: y, bx: target, by: y });
            } else {
              this.map[y][0].done = true;
            }
          }
        }
        break;
      case 2://s : down
        for (let x = 0; x < this.x; x++) {
          for (let y = this.y - 1; y > 0; y--) {
            if (this.map[y][x].val === 0) continue
            for (let dy = y - 1; dy >= 0; dy--) {
              if (this.map[dy][x].val === 0 && dy !== 0) continue
              if (this.map[y][x].val == this.map[dy][x].val && !this.map[y][x].done && !this.map[dy][x].done && this.map[y][x].val !== 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[target][x].val = this.map[y][x].val + this.map[dy][x].val;
                  this.map[y][x].val = 0;
                  this.map[dy][x].val = 0;
                  this.map[target][x].done = true;
                  this.stack.push({ ax: x, ay: y, bx: x, by: target });
                  this.stack.push({ ax: x, ay: dy, bx: x, by: target });
                } else {
                  this.map[y][x].val += this.map[dy][x].val;
                  this.map[dy][x].val = 0;
                  this.map[y][x].done = true;
                  this.stack.push({ ax: x, ay: dy, bx: x, by: y });
                }
                this.score += this.map[y][x].val + this.map[dy][x].val;
                break;
              } else if (!this.map[dy][x].done && this.map[dy][x].val !== 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[target][x].val = this.map[y][x].val;
                  this.map[y][x].val = 0;
                  this.map[target][x].done = true;
                  this.stack.push({ ax: x, ay: y, bx: x, by: target });
                } else {
                  this.map[y][x].done = true;
                }
                break;
              } else if (dy === 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[target][x].val = this.map[y][x].val;
                  this.map[y][x].val = 0;
                  this.map[target][x].done = true;
                  this.stack.push({ ax: x, ay: y, bx: x, by: target });
                } else {
                  this.map[y][x].done = true;
                }
                break;

              }
            }
          }
          if (!(this.map[0][x].val === 0)) {
            let target = this.getBlankSpace(e, x, 0);
            if (!(target === false)) {
              this.map[target][x].val = this.map[0][x].val;
              this.map[0][x].val = 0;
              this.map[target][x].done = true;
              this.stack.push({ ax: x, ay: 0, bx: x, by: target });
            } else {
              this.map[0][x].done = true;
            }
          }
        }
        break;
      case 3://w : up
        for (let x = 0; x < this.x; x++) {
          for (let y = 0; y < this.y - 1; y++) {
            if (this.map[y][x].val === 0) continue
            for (let dy = y + 1; dy < this.y; dy++) {
              if (this.map[dy][x].val === 0 && dy !== this.y - 1) continue
              if (this.map[y][x].val == this.map[dy][x].val && !this.map[y][x].done && !this.map[dy][x].done && this.map[y][x].val !== 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[target][x].val = this.map[y][x].val + this.map[dy][x].val;
                  this.map[y][x].val = 0;
                  this.map[dy][x].val = 0;
                  this.map[target][x].done = true;
                  this.stack.push({ ax: x, ay: y, bx: x, by: target });
                  this.stack.push({ ax: x, ay: dy, bx: x, by: target });
                } else {
                  this.map[y][x].val += this.map[dy][x].val;
                  this.map[dy][x].val = 0;
                  this.map[y][x].done = true;
                  this.stack.push({ ax: x, ay: dy, bx: x, by: y });
                }
                this.score += this.map[y][x].val + this.map[dy][x].val;
                break;
              } else if (!this.map[dy][x].done && this.map[dy][x].val !== 0) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[target][x].val = this.map[y][x].val;
                  this.map[y][x].val = 0;
                  this.map[target][x].done = true;
                  this.stack.push({ ax: x, ay: y, bx: x, by: target });
                } else {
                  this.map[y][x].done = true;
                }
                break;
              } else if (dy === this.y - 1) {
                let target = this.getBlankSpace(e, x, y);
                if (!(target === false)) {
                  this.map[target][x].val = this.map[y][x].val;
                  this.map[y][x].val = 0;
                  this.map[target][x].done = true;
                  this.stack.push({ ax: x, ay: y, bx: x, by: target });
                } else {
                  this.map[y][x].done = true;
                }
                break;

              }
            }
          }
          if (!(this.map[this.y - 1][x].val === 0)) {
            let target = this.getBlankSpace(e, x, this.y - 1);
            if (!(target === false)) {
              this.map[target][x].val = this.map[this.y - 1][x].val;
              this.map[this.y - 1][x].val = 0;
              this.map[target][x].done = true;
              this.stack.push({ ax: x, ay: this.y - 1, bx: x, by: target });
            } else {
              this.map[this.y - 1][x].done = true;
            }
          }
        }
        break;
    }
    this.drawView() ? (
      setTimeout(() => {
        //!this.setRandomBlock() && alert('GAMEOVER');
        !this.scanGameover() ? this.setRandomBlock() : alert('GAMEOVER')
        this.click = false
      }, 100)
    ) : (
      this.scanGameover() && alert('GAMEOVER'),
        this.click = false
    )
  }

  scanGameover() {
    let b = true
    this.map.forEach(e => {
      e.forEach(el => {
        if (el.val === 0) {
          b = false;
        }
      })
    })
    if (!b) {
      return false;
    } else {
      for (let y = 0; y < this.y; y++) {
        for (let x = 0; x < this.x - 1; x++) {
          if (this.map[y][x].val === this.map[y][x + 1].val) {
            b = false;
            break;
          }
        }
        if (!b) break;
      }
      if (!b) return false;
      for (let x = 0; x < this.x; x++) {
        for (let y = 0; y < this.y - 1; y++) {
          if (this.map[y][x].val === this.map[y + 1][x].val) {
            b = false;
            break;
          }
        }
        if (!b) break;
      }
      if (!b) return false;
    }

    return true;
  }

  async postScore() {
    axios
      .post(`//${this.api}/score`, {
        gameId: 1,
        user: '아무개',
        score: this.score,
      }, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });


  }
}

class block {
  constructor(n) {
    this.val = n;
    this.done = false;
    this.readyblock = false;

    this.el = document.createElement("div");
    this.el.className = 'tile_wrap';
    this.subel = document.createElement("div");
    this.subel.className = 'tile';
    this.subel.innerText = n;
  }

  add(sum) {
    !this.done && (
      this.val += sum,
        this.done = true
    )
  }

  remove() {
    this.val = 0;
    this.done = false;
  }

  getel() {
    return this.el;
  }

  setel(el) {
    this.el = el;
  }

  getSubel() {
    return this.subel;
  }

  setSubel(el) {
    this.subel = el;
  }

  takeval(e) {
    this.val = e.val;
    this.el.style.display = 'block';
    this.subel.innerText = this.val;
    e.val = 0;
    e.subel.innerText = 0;
    e.done = false;
    e.el.style.display = 'none';
  }
}

window.onload = () => {
  axios.defaults.withCredentials = true; // withCredentials 전역 설정
  const x = 4;
  const y = 4;

  const tileY = document.createElement("ul");
  tileY.className = "tileY";
  new Array(y).fill(1).map(e => {
    const li = document.createElement('li');

    const tileX = document.createElement("ul");
    tileX.className = "tileX";
    new Array(x).fill(1).map(e => {
      const li = document.createElement('li');
      tileX.appendChild(li);
    })

    li.appendChild(tileX);
    tileY.appendChild(li);
  })

  const bg_map = document.querySelector(".bg_map");
  bg_map.appendChild(tileY);
  new map(x, y);
}
