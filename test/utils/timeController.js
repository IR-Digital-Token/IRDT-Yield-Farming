/* eslint-disable */
module.exports.advanceTime = async function(time){
  var res;
  await web3.currentProvider.send({ jsonrpc: '2.0', method: 'evm_mine', params: [time], id: Math.random()*10000}, (err, r) => { res = r });
  while (res == undefined) {
      await new Promise(resolve => setTimeout(resolve, 100));
  }
  return res;
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