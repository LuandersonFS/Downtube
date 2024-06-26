import {decipher,createNewDecipher,request} from "./index"
export default function resolveSigCipher(signatureCipher: string, jsPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let sig: any = {},
        source: string,
        basejsSource = "https://www.youtube.com" + jsPath;
      for (let n of signatureCipher.split("&")) {
        let a = n.split("=");
        sig[a[0]] = decodeURIComponent(a[1]);
      }
      let decipherResponse = decipher(sig.s);
      if ("deciphers" in decipherResponse) {
        request(basejsSource)
          .then((res) => {
            let basejs = "";
            res.on("data", (data) => {
              basejs += data.toString();
            });
            res.on("end", () => {
              let newDecipher;
              try {
                newDecipher = createNewDecipher(basejs, decipherResponse.deciphers);
              } catch (err) {
                return reject(err);
              }
              source = `${sig.url}&sig=${encodeURIComponent(
                newDecipher.main(sig.s)
              )}`;
            });
          })
          .catch(reject);
      } else {
        source = `${sig.url}&sig=${encodeURIComponent(
         decipherResponse.deciphed
       	)}`;
      }
    });
  }
