import { Readable } from 'node:stream';

class FakeUploadStream extends Readable {
  index = 1;

  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 5) {
        this.push(null);
      } else {
        const buffer = Buffer.from(String(i));
        this.push(buffer);
      }
    }, 1000);
  }
}

fetch('http://localhost:3334', {
  method: 'POST',
  body: new FakeUploadStream(),
  duplex: 'half'
}).then(response => response.text()).then(data => console.log(data));