var app = new Vue({
  el: '#app',
  data: {
    contractAddress: '0x2c2b9c9a4a25e24b174f26114e8926a9f2128fe4',
    account: 'my account',
    abi: "",
    value: "",
    block: "",
    input: "",
    inputValue: "",
    inputBlock: "",
    transactionId: "",
    simpleStorageContract: "",
    simpleStorage: "",
    response: "",
    contractURL: ""
  },
  beforeMount: function () {
    this.$nextTick((function () {
      // Code that will run only after the
      // entire view has been rendered

      this.init()
    }).bind(this))
  },
  methods: {
    init: function () {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
      } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
      }
      // Now you can start your app & access web3 freely:

      this.abi = [{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"}]

      web3.eth.defaultAccount = web3.eth.accounts[0]

      this.simpleStorageContract = web3.eth.contract(this.abi);
      this.simpleStorage = this.simpleStorageContract.at(this.contractAddress);
      web3.eth.getAccounts((function(error, result){
        // console.log(result)

        this.account = result[0]
        this.accountURL = "https://testnet.etherscan.io/address/" + this.account
      }).bind(this))
    },
    getValue: function () {
      this.simpleStorage.get((function(error, result){
        //console.log("getValue")
        //console.log(result)

        this.value = result
      }).bind(this))

      web3.eth.getBlockNumber((function(error, result){
        // console.log(result)

        this.block = result;
      }).bind(this))
    },
    setValue: function () {
      this.simpleStorage.set(this.inputValue, (function(error, result){
        // console.log("setValue")
        // console.log(result)
        this.transactionId = result

        var filter = web3.eth.filter('latest');
        filter.watch((function(error, result) {
          web3.eth.getTransaction(this.transactionId, (function(error, result){
            // console.log(result)

            if (result != null && result.blockNumber > 0) {
              this.inputBlock = result.blockNumber
              this.inputValue = this.input
              this.response = result

              filter.stopWatching()
            }
         }).bind(this))
       }).bind(this))
      }).bind(this))
    }
  }
})
