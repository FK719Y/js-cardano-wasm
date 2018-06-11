const expect = require('chai').expect;
const CardanoCrypto = require('../../dist/index.js');

const NUM_UNKNOWN_ADDRESSES  = 10000;
const NUM_KNOWN_ADDRESSES    = 10000;
const UNKNOWN_ADDRESS        = "DdzFFzCqrht8bHGhehfWkQHYQ6oXwXanJF12e2AmqwerXV5WE4NY95VmGTcZH676VQpjjPWczLq68f1CmbdkEKkQ8JDEVDYqmtpyq2s1";
const KNOWN_ADDRESS          = "DdzFFzCqrhsgMKiTZ4L8xPasnrwwx5xbrg3fsUaRb8XqvZR5izst4AH5eZHupDobicTLCnN5YKh1m91EbSUKc312osrTCFkD6aRZxpqH";


const uint8ArrayToHexadecimal = array =>
    R.reduce((string, byte) => string + byte.toString(16), '', array)


describe('Random Address Checker', async function() {
    let checker = null;
    let xprv = null;

    before(async () => {
        await CardanoCrypto.loadRustModule()
    });

    it("create a private key", function() {
        const seed    = new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]);
        xprv    = CardanoCrypto.HdWallet.fromSeed(seed);
    });
    it("create a random checker", function() {
        let xprv_hex = Buffer.from(xprv).toString('hex');
        const result = CardanoCrypto.RandomAddressChecker.newChecker(xprv_hex);
        if (result.failed === true) { console.error(result); }
        expect(result.failed).equals(false);
        checker = result.result;
    });

    it("Check " + NUM_UNKNOWN_ADDRESSES + " random addresses are not mine", function() {
        const addresses = Array.apply(null, Array(NUM_UNKNOWN_ADDRESSES)).map(() => { return UNKNOWN_ADDRESS; });
        let result = CardanoCrypto.RandomAddressChecker.checkAddresses(checker, addresses);

        if (result.failed === true) {
            console.error(result);
        }
        expect(result.failed).equals(false);
        expect(result.result.length).equals(0);
    });

    it("Check " + NUM_KNOWN_ADDRESSES + " random addresses are mines", function() {

        const addresses = Array.apply(null, Array(NUM_KNOWN_ADDRESSES)).map(() => { return KNOWN_ADDRESS; });
        let result = CardanoCrypto.RandomAddressChecker.checkAddresses(checker, addresses);

        if (result.failed === true) {
            console.error(result);
        }
        expect(result.failed).equals(false);
        expect(result.result.length).equals(NUM_KNOWN_ADDRESSES);
    });
});

