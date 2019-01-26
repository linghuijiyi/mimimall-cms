class Storage {
    constructor () {
        this.storage = window.sessionStorage;
    }

    get (key) {
        if (!key) {
            let ret = {};
            this.each((key, val) => {ret[key] = val});
            return ret;
        }
        return this.deserialize(this.storage.getItem(key));
    }

    set (key, val) {
        if (key && !this.isJSON(key)) this.storage.setItem(key, JSON.stringify(val));
        else for (let a in key) this.set(a, key[a]);
    }

    each (callback) {
        for (let i = 0; i < this.storage.length; i++) {
            let key = this.storage.key(i);
            callback(key, this.get(key));
        }
    }

    deserialize (value) {
        if (typeof value !== 'string') return undefined;
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    }

    isJSON (obj) {
        return typeof obj === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length;
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }
}

export default new Storage();