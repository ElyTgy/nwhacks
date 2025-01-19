/**
 * @name MuseJS
 * @version 1.0 | June 2022
 * @author  Respiire Health Systems Inc.
 * @license MIT
 */

class MuseDynamicBuffer {
  constructor() {
      this.memory = [];
  }

  write(...values) {
    this.memory.push(...values);
}

  flush() {
      const data = this.memory.slice();
      this.memory = [];
      return data;
  }

  clear() {
      this.memory = [];
  }
}

class Muse {
  constructor() {
    this.SERVICE = 0xfe8d;
    this.CONTROL_CHARACTERISTIC = '273e0001-4c4d-454d-96be-f03bac821358';
    this.EEG1_CHARACTERISTIC = '273e0003-4c4d-454d-96be-f03bac821358';  // TP9
    this.EEG2_CHARACTERISTIC = '273e0004-4c4d-454d-96be-f03bac821358';  // FP1
    this.EEG3_CHARACTERISTIC = '273e0005-4c4d-454d-96be-f03bac821358';  // FP2
    this.EEG4_CHARACTERISTIC = '273e0006-4c4d-454d-96be-f03bac821358';  // TP10
    this.state = 0;
    this.dev = null;
    this.controlChar = null;
    this.info = { };
    this.infoFragment = "";
    this.eeg = [
      new MuseDynamicBuffer(),
      new MuseDynamicBuffer(),
      new MuseDynamicBuffer(),
      new MuseDynamicBuffer()
    ];
    
    this.isRecording = false;
    this.startTimestamp = null;
  }

  decodeInfo(bytes) {
    return new TextDecoder().decode(bytes.subarray(1, 1 + bytes[0]));
  }
  
  decodeUnsigned24BitData(samples) {
    const samples24Bit = [];
    for (let i = 0; i < samples.length; i = i + 3) {
      samples24Bit.push((samples[i] << 16) | (samples[i + 1] << 8) | samples[i + 2]);
    }
    return samples24Bit;
  }
  
  decodeUnsigned12BitData(samples) {
    const samples12Bit = [];
    for (let i = 0; i < samples.length; i++) {
      if (i % 3 === 0) {
         samples12Bit.push((samples[i] << 4) | (samples[i + 1] >> 4));
      } else {
        samples12Bit.push(((samples[i] & 0xf) << 8) | samples[i + 1]);
        i++;
      }
    }
    return samples12Bit;
  }

  startRecording() {
      this.isRecording = true;
      this.startTimestamp = Date.now();
      console.log(`Recording started at ${this.startTimestamp}`);
  }

  stopRecording() {
      if (!this.isRecording) return null;

      const endTimestamp = Date.now();
      console.log(`Recording stopped at ${endTimestamp}`);

      this.eeg.forEach((buffer, index) => {
        console.log(`EEG channel ${index} length: ${buffer.memory.length}`);
    });

      const recordedData = {
          startTimestamp: this.startTimestamp,
          endTimestamp: endTimestamp,
          eegData: this.eeg.map(buffer => buffer.flush())
      };



      this.isRecording = false;
      this.startTimestamp = null;

      return recordedData;
  }

  encodeCommand(cmd) {
    const encoded = new TextEncoder().encode(`X${cmd}\n`);
    encoded[0] = encoded.length - 1;
    return encoded;
  }
  // -------------------------------------

  controlData (event) {
      
    var data = event.target.value;
    data = data.buffer ? data: new DataView(data);
    var buf = new Uint8Array(data.buffer);
    var str = this.decodeInfo(buf);
    for (var i = 0; i<str.length;i++) {
      var c = str[i];
      this.infoFragment = this.infoFragment + c;
      // { make bracket matching happy
      if (c=='}') {
        var tmp = JSON.parse(this.infoFragment);
        this.infoFragment = "";
        for (const key in tmp) {
          this.info[key] = tmp[key];
        }
      }
    }
  }

  eegData (n,event) {

    if (this.isRecording == false) return;

    var data = event.target.value;
    data = data.buffer ? data: new DataView(data);
    var samples = this.decodeUnsigned12BitData(new Uint8Array(data.buffer).subarray(2));
    samples = samples.map(function (x) { return 0.48828125 * (x - 0x800); });
    for (var i=0;i<samples.length;i++) {
        this.eeg[n].write(samples[i]);
    }
  }
  // -------------------------------------
  async sendCommand(cmd) {
    await this.controlChar["writeValue"](this.encodeCommand(cmd));
  }

  async pause () {
    await this.sendCommand('h');
  }

  async resume () {
    await this.sendCommand('d');
  }

  async start () {
    await this.pause();
    // only EEG
    await this.sendCommand('p21');
    // EEG + PPG
    await this.resume();
  }

  disconnect() {
    if (this.dev) this.dev["gatt"]["disconnect"]();
    this.dev = null;
    this.state = 0;
  }
  
  onDisconnected() {
    this.dev = null;
    this.state=0;
  }
  
  async connectChar (service,cid,hook) {
    var c = await service["getCharacteristic"](cid);
    c["oncharacteristicvaluechanged"] = hook;
    c["startNotifications"]();
    return c;
  }

  async connect() {
    if (this.dev||this.state!=0) { return; }

    this.state=1;
    
    try {
      this.dev = await navigator["bluetooth"]["requestDevice"]({
        "filters": [{ "services": [this.SERVICE]}],
      });
    } catch (error) { 
      this.dev= null;
      this.state = 0;
      return;
    }
    
    try {
      var gatt = await this.dev["gatt"]["connect"]();
    } catch (error) {
      this.dev= null;
      this.state = 0;
      return;
    }

    var service = await gatt["getPrimaryService"](this.SERVICE);
    
    var that = this;
    this.dev.addEventListener('gattserverdisconnected',
      function () { that.onDisconnected(); } );
    this.controlChar = await this.connectChar(service,this.CONTROL_CHARACTERISTIC,
      function (event) { that.controlData(event); } );
    await this.connectChar(service,this.EEG1_CHARACTERISTIC,
      function (event) { that.eegData(0,event); } );
    await this.connectChar(service,this.EEG2_CHARACTERISTIC,
      function (event) { that.eegData(1,event); } );
    await this.connectChar(service,this.EEG3_CHARACTERISTIC,
      function (event) { that.eegData(2,event); } );
    await this.connectChar(service,this.EEG4_CHARACTERISTIC,
      function (event) { that.eegData(3,event); } );
    await this.start();
    await this.sendCommand('v1');
    this.state = 2;

  }
}
