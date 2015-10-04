$(function(){
	var output = $('#queue-response'),
		request_uri = 'http://top-frog.com/stuff/ajax-queue/',
		myQueue = new ajaxQueue(),
		theQueue = new ajaxQueue(),
		randInt;
		
	myQueue.complete = function(data, textStatus, jqXHR) {
		output.find('#queue1')
			.append('<hr>')
			.append('<p><span class="glyphicon glyphicon-sunglasses" aria-hidden="true"></span> <b>Queue 1: All Requests Complete</b></p>');
	};
	
	theQueue.complete = function(r) {
		output.find('#queue2')
			.append('<hr>')
			.append('<p><span class="glyphicon glyphicon-sunglasses" aria-hidden="true"></span> <b>Queue 2: All Requests Complete</b></p>');	
	};
	
	var randomInt = function(min, max) {
		return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
	};
	
	var addNotice = function(noticeText, type, queueNum) {
		var type = type || 'info',
			glyphicon,
			icon;
		
		if (type == 'success') {
			glyphicon = 'ok';
		} else if (type == 'danger') {
			glyphicon = 'exclamation-sign';
		} else if (type == 'info') {
			glyphicon = 'plus';
		} else if (type == 'warning') {
			glyphicon = 'hand-right';
		}
		
		icon = '<span class="glyphicon glyphicon-' + glyphicon + ' aria-hidden="true"></span> ';
		
		output
			.find('#queue' + queueNum)
			.append($('<div class="alert alert-' + type + '" role="alert">' + icon + noticeText + '</div>'))
	};
	
	var successCallback = function(queueNum, reqNum) {
		return function(r) {
			addNotice('<b>Queue ' + queueNum + ':</b> #' + reqNum + ' Success', 'success', queueNum);
		};
	};
	
	var errorCallback = function(queueNum, reqNum) {
		return function(r) {
			addNotice('<b>Queue ' + queueNum + ':</b> #' + reqNum + ' Failure', 'danger', queueNum);
		}
	};
	
	addNotice('<b>Queue 1:</b> queueing #1', 'info', 1);
	myQueue.add(
		request_uri,
		'post',
		{
			data: {
				n: randomInt(0, 4)
			},
			type: 'text',
			success: successCallback(1, 1),
			error: errorCallback(1, 1)
		}
	);
	
	addNotice('<b>Queue 1:</b> adding #2', 'info', 1);
	myQueue.add(
		request_uri,
		'post',
		{
			data: {
				n: randomInt(0, 4)
			},
			success: successCallback(1, 2),
			error: errorCallback(1, 2),
			complete: function(r) {
				addNotice('<b>Queue 1:</b> Complete #2. Adding more requests ', 'warning', 1);
				
				// continue adding to myQueue
				// Provide Success Method
				addNotice('<b>Queue 1:</b> adding #3', 'info', 1);
				myQueue.add(
					request_uri,
					'post',
					{
						data: {
							n: randomInt(0, 4)
						},
						success: successCallback(1, 3),
						error: errorCallback(1, 3)
					}
				);

				// Provide error method
				addNotice('<b>Queue 1:</b> adding #4', 'info', 1);
				myQueue.add(
					request_uri,
					'post',
					{
						data: {
							n: randomInt(0, 4)
						},
						success: successCallback(1, 4),
						error: errorCallback(1, 4)
					}
				);

				// Provide Complete Method
				addNotice('<b>Queue 1:</b> adding #5', 'info', 1);
				myQueue.add(
					request_uri,
					'post',
					{
						data: {
							n: randomInt(0, 4)
						},
						success: successCallback(1, 5),
						error: errorCallback(1, 5)
					}
				);
			}
		}
	);
	
	addNotice('<b>Queue 2:</b> adding #1', 'info', 2);
	theQueue.add(
		request_uri,
		'post',
		{
			data: {
				n: randomInt(0, 4)
			},
			success: successCallback(2, 1),
			error: errorCallback(2, 1)
		}
	);
	
	addNotice('<b>Queue 2:</b> adding #2', 'info', 2);
	theQueue.add(
		request_uri,
		'post',
		{
			data: {
				n: randomInt(0, 4)
			},
			success: successCallback(2, 2),
			error: errorCallback(2, 2)
		}
	);
	
	// run
	theQueue.run();
	myQueue.run();
});