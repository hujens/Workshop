App = {
    //Initialize variables (TODO: needed?)
    
    web3Provider: null,
    contracts: {},/*
    emptyAddress: "0x0000000000000000000000000000000000000000",
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    supplierID: "0x0000000000000000000000000000000000000000",
    supplierName: null,
    supplierInformation: null,
    productNotes: null,
    productPrice: 0,
    contractorName: null,
    contractorInformation: null,
    installationPrice: 0,
    customerID: "0x0000000000000000000000000000000000000000",
    customerName: null,
    amountPay: 0,
    amountBuy: 0,
    check: true,
    address: "0x0000000000000000000000000000000000000000",*/

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    // fetches field entries
    readForm: function () {
        App.address = $("#address").val();
        App.upc = $("#upc").val();
        App.upc2 = $("#upc2").val();
        App.upc3 = $("#upc3").val();
        App.upc4 = $("#upc4").val();
        App.architectName = $("#architectName").val();
        App.engineerID = $("#engineerID").val();
        App.engineerName = $("#engineerName").val();
        App.check = JSON.parse($("#check").val()); //convert to boolean
        App.data = $("#data").val();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache (ganache-cli: 7545, UI: 8545)
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();
    
        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },


    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/ExampleWorkflow.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            

            //TODO: what does this do?
            App.fetchEvents();
        });

        // listens to "button-clicks"
        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();
        //Update values with field-entries before calling functions
        App.readForm();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.createObject(event);
                break;
            case 2:
                return await App.fillItem(event);
                break;
            case 3:
                return await App.checkObject(event);
                break;
            case 4:
                return await App.executeLogic(event);
                break;
            case 5:
                return await App.fetchItem(event);
                break;
            case 6:
                return await App.addArchitect(event);
                break;  
            case 7:
                return await App.addEngineer(event);
                break;
            }
    },

    createObject: function(event) {
        event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));
        console.log(
            "/ architectName:", App.architectName,
            "/ engineerID:", App.engineerID,
            "/ engineerName:", App.engineerName,
            "/ caller:", App.metamaskAccountID
        );

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.createObject(
                App.architectName, 
                App.engineerID,
                App.engineerName,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('createObject',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fillItem: function (event) {
        event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));
        console.log(
            "upc:", App.upc2,
            "/ data:", App.data,
            "/ caller:", App.metamaskAccountID
        );

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fillItem(
                App.upc2,
                App.data,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('fillItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    checkItem: function (event) {
        event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));
        console.log(
            "upc:", App.upc3,
            "/ check:", App.check,
            "/ caller:", App.metamaskAccountID
        );

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.checkItem(
                App.upc3,
                App.check,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('checkItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    executeLogic: function (event) {
        event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));
        console.log(
            "upc:", App.upc4,
            "/ caller:", App.metamaskAccountID
        );

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.payItem(
                App.upc4,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('executeLogic',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },


    fetchItem: function () {
    ///   event.preventDefault();
    ///   var processId = parseInt($(event.target).data('id'));
        //App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-fetchData1").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchItemBufferTwo.call(App.upc);
          }).then(function(result) {
            $("#ftc-fetchData2").text(result);
            console.log('fetchItemBufferTwo', result);
          }).catch(function(err) {
            console.log(err.message);
        });
    },

    addArchitect: function (event) {
        event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));
        console.log(
            "address:", App.address,
        );

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addArchitect(
                App.address,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addArchitect',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addEngineer: function (event) {
        event.preventDefault();
        //var processId = parseInt($(event.target).data('id'));
        console.log(
            "address:", App.address,
        );

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addEngineer(
                App.address,
                {from: App.metamaskAccountID}
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addEngineer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });

    }
};

// calls App.init()
$(function () {
    $(window).load(function () {
        App.init();
    });
});