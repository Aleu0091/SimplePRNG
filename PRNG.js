// 1. Linear Congruential Generator (LCG)
function lcg(seed) {
    let state = seed;
    return function () {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

// 2. Middle Square Method
function middleSquare(seed) {
    let state = seed;
    return function () {
        state = (state * state).toString().padStart(8, "0").slice(1, 7);
        return parseInt(state, 10) / 1000000;
    };
}

// 3. Mersenne Twister (simplified version)
function mersenneTwister(seed) {
    let mt = new Array(624).fill(0);
    let index = 0;
    mt[0] = seed;
    for (let i = 1; i < 624; i++) {
        mt[i] = (1812433253 * (mt[i - 1] ^ (mt[i - 1] >>> 30)) + i) >>> 0;
    }

    function twist() {
        for (let i = 0; i < 624; i++) {
            let y = (mt[i] & 0x80000000) + (mt[(i + 1) % 624] & 0x7fffffff);
            mt[i] = mt[(i + 397) % 624] ^ (y >>> 1);
            if (y % 2 !== 0) mt[i] ^= 2567483615;
        }
    }

    return function () {
        if (index === 0) twist();
        let y = mt[index];
        y ^= y >>> 11;
        y ^= (y << 7) & 2636928640;
        y ^= (y << 15) & 4022730752;
        y ^= y >>> 18;
        index = (index + 1) % 624;
        return y / 4294967296;
    };
}

// 4. SplitMix64
function splitMix64(seed) {
    let state = seed;
    return function () {
        state = (state + 0x9e3779b97f4a7c15n) & 0xffffffffffffffffn;
        let z = state;
        z = (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n;
        z = (z ^ (z >> 27n)) * 0x94d049bb133111ebn;
        return Number((z ^ (z >> 31n)) & 0xffffffffffffffffn) / 2 ** 64;
    };
}

// 5. XORShift
function xorshift(seed) {
    let state = seed;
    return function () {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return (state >>> 0) / 4294967296;
    };
}

// 6. Lehmer Random Generator
function lehmer(seed) {
    let state = seed;
    return function () {
        state = (state * 48271) % 2147483647;
        return state / 2147483647;
    };
}

// 7. Blum Blum Shub
function blumBlumShub(seed) {
    const p = 383,
        q = 503,
        m = p * q;
    let state = (seed * seed) % m;
    return function () {
        state = (state * state) % m;
        return state / m;
    };
}

// 8. Park-Miller RNG
function parkMiller(seed) {
    let state = seed;
    return function () {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
}

// 9. Multiply With Carry
function multiplyWithCarry(seed, carry) {
    let state = seed;
    return function () {
        const a = 4294957665;
        let t = a * state + carry;
        carry = t >>> 32;
        state = t & 0xffffffff;
        return state / 4294967296;
    };
}

// 10. WELL512
function well512(seed) {
    let state = new Array(16).fill(0);
    let index = 0;
    for (let i = 0; i < 16; i++) state[i] = seed ^ (seed >>> i);

    return function () {
        let a = state[index];
        let c = state[(index + 13) & 15];
        let b = a ^ c ^ (a << 16) ^ (c << 15);
        c = state[(index + 9) & 15];
        c ^= c >>> 11;
        a = state[index] = b ^ c;
        let d = a ^ ((a << 5) & 0xda442d24);
        index = (index + 15) & 15;
        state[index] ^= d;
        return state[index] / 4294967296;
    };
}

// 11. Xorwow
function xorwow(seed) {
    let state = [seed, seed + 1, seed + 2, seed + 3, seed + 4];
    let counter = 0;

    return function () {
        let t = state[3];
        let s = state[0];
        state[3] = state[2];
        state[2] = state[1];
        state[1] = s;
        t ^= t >>> 2;
        t ^= t << 1;
        t ^= s ^ (s << 4);
        state[0] = t;
        counter = (counter + 362437) | 0;
        return ((t + counter) >>> 0) / 4294967296;
    };
}

// 12. Xorshift7
function xorshift7(seed) {
    let state = seed;

    return function () {
        state ^= state >>> 7;
        state ^= state << 7;
        state ^= state >>> 3;
        state ^= state << 5;
        state ^= state >>> 11;
        return (state >>> 0) / 4294967296;
    };
}

// 13. Xor128
function xor128(seed) {
    let state = [seed, seed + 1, seed + 2, seed + 3];

    return function () {
        let t = state[0] ^ (state[0] << 11);
        state[0] = state[1];
        state[1] = state[2];
        state[2] = state[3];
        state[3] ^= state[3] >>> 19;
        state[3] ^= t ^ (t >>> 8);
        return (state[3] >>> 0) / 4294967296;
    };
}

// 14. Xor4096
function xor4096(seed) {
    const state = new Uint32Array(128);
    let index = 0;

    for (let i = 0; i < state.length; i++) {
        seed ^= seed << 13;
        seed ^= seed >>> 17;
        seed ^= seed << 5;
        state[i] = seed >>> 0;
    }

    return function () {
        index = (index + 1) & 127;
        let t = state[index];
        t ^= t << 13;
        t ^= t >>> 17;
        t ^= t << 5;
        state[index] = t;
        return (t >>> 0) / 4294967296;
    };
}

// 15. Tychei
function tychei(seed) {
    let state = [seed & 0xffffffff, seed >>> 32];

    function nextState() {
        state[0] += 0x9e3779b97f4a7c15n;
        state[0] = BigInt.asUintN(64, state[0]);
        let x = state[1];
        x ^= x >>> 27n;
        x ^= x << 17n;
        x ^= x >>> 5n;
        state[1] = x;
    }

    return function () {
        nextState();
        return Number(state[1] & 0xffffffffn) / 4294967296;
    };
}
