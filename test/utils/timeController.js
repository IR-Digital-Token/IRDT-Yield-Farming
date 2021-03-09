/* eslint-disable */
module.exports.advanceTime = async function(time){
    return new Promise((resolve, reject) => {
        web3.currentProvider.send(
          {
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time],
            id: new Date().getTime(),
          },
          (err, _) => {
            if (err) {
              return reject(err);
            }
            const newBlockHash = web3.eth.getBlock("latest").hash;
    
            return resolve(newBlockHash);
          },
        );
      });
};

module.exports.advanceBlock = async function(){
    return new Promise((resolve, reject) => {
        web3.currentProvider.send(
            {
                jsonrpc: "2.0",
                method: "evm_mine",
                params: [],
                id: new Date().getTime()
            },
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                console.log(result)
                return resolve(result);
            }
        );
       
    });
};