Ext.onReady(function(){

	Ext.BLANK_IMAGE_URL ='../ext-4.0.7-gpl/resources/themes/images/default/tree/s.gif'; 
	
	var userStore = Ext.create('Ext.data.Store', {
		id:'userStoreId',
		autoLoad:false,
		pageSize:5,
		fields:['serverId','username','loginTime','uid','address'],
		proxy: {
			type: 'memory',
			reader: {
				type: 'json',
				root: 'requests'
			}
		}
	});

	/**
	 * userGrid,detail users' message
	 */
	var userGrid=Ext.create('Ext.grid.Panel', {
		id:'userGridId',
		region:'center',
	    store: userStore,
	    columns:[
			{xtype:'rownumberer',width:50,sortable:false},
			{text:'serverId',width:150,dataIndex:'serverId'},
			{text:'userName',dataIndex:'username',width:200},
			{text:'uid',dataIndex:'uid',width:50},
			{text:'address',dataIndex:'address',width:200},
			{text:'loginTime',dataIndex:'loginTime',width:200}
		]
	});

	var viewport=new Ext.Viewport({
		layout:'border',
		items:[{
			region:'north',
			height:30,
			contentEl:onlineUsersInfo
		}, userGrid]
	});
});

var STATUS_INTERVAL = 5 * 1000; // 60 seconds
/*
socket.on('connect', function(){
	socket.emit('announce_web_client');
	socket.emit('webMessage', {method: 'getOnlineUser'});

	socket.on('getOnlineUser',function(msg){  
		var totalConnCount = msg.totalConnCount;
		var loginedCount = msg.loginedCount;
		var onlineUserList = msg.onlineUserList
		var store = Ext.getCmp('userGridId').getStore();
		contentUpdate(totalConnCount, loginedCount);
		store.loadData(onlineUserList);
	});
});*/

setInterval(function() {
	window.parent.client.request('onlineUser', null, function(err, msg) {
		if(err) {
			console.error('fail to request online user:');
			console.error(err);
			return;
		}

		var totalConnCount = 0, loginedCount = 0, info, list = [];
		var msg2=msg;
		for(var sid in msg2) {
			console.log("------------" + sid);
			info = msg2[sid];
            /**
			 * {
					"connector-server-2": {
					"serverId": "connector-server-2",
					"totalConnCount": 0,
					"loginedCount": 0,
					"loginedList": []
					},
					"connector-server-3": {
					"serverId": "connector-server-3",
					"totalConnCount": 0,
					"loginedCount": 0,
					"loginedList": []
					},
					"connector-server-1": {
					"serverId": "connector-server-1",
					"totalConnCount": 0,
					"loginedCount": 1,
					"loginedList": [
					{
					"loginTime": 1530423576927,
					"uid": "A113516479",
					"address": "::ffff:172.17.132.172:61183"
					}
					]
					}
					}
             */
			console.log("-----------"+ JSON.stringify(info))

			for(var  connector in info){
                totalConnCount += info[connector].totalConnCount;
                loginedCount += info[connector].loginedCount;
                var lists = info[connector].loginedList;
                if(!!lists){
                    for(var i=0;i<lists.length;i++){
                        list.push({
                            address : lists[i].address,
                            serverId : connector,
                            username : lists[i].username,
                            loginTime : new Date(parseInt(lists[i].loginTime)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "),
                            uid : lists[i].uid
                        });
                    }
				}
			}
		}

		contentUpdate(totalConnCount, loginedCount);

		var store = Ext.getCmp('userGridId').getStore();
		console.log(list);
		store.loadData(list);
	});
}, STATUS_INTERVAL);

function contentUpdate(totalConnCount, loginedCount){
	document.getElementById("totalConnCount").innerHTML = totalConnCount;
	document.getElementById("loginedCount").innerHTML = loginedCount;
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
