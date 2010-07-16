<?php
	if (!empty($_POST) && !empty($_POST['num'])) {
		if ($_POST['num'] == 'two') {
			header('HTTP/1.0 404 Not Found');
			exit;
		}
		else {
			header('content-type: text/plain');
			sleep(2);
			echo $_POST['num'];
			exit;
		}
	}
?><!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
   "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>jQuery Queue Test</title>
		<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js?ver=1.4.2'></script>
		<script type="text/javascript" src="ajaxQueue.js"></script>
		<!-- Date: 2010-07-16 -->
	</head>
	<body>
		<h1>jQuery Queue Test</h1>
		<p>This example queues up four requests. Request #2 queues up 3 more on successful completion of its request.</p>
		<p><b>Responses:</b></p>
		<pre id="queue-response"></pre>
	
		<script type="text/javascript">
			$(function(){			
				request_uri = '<?php echo $_SERVER["REQUEST_URI"]; ?>';
				
				// start a queue
				myQueue = new ajaxQueue();
				$('#queue-response').append("queueing one\n");
				myQueue.add(
					request_uri,
					'post',
					{
						data: { num: 'one' },
						type: 'text',
						success: function(r) {
							$('#queue-response').append('$.success - response: ' + r + "\n");
						}
					}
				);
				
				$('#queue-response').append("queueing two\n");
				myQueue.add(
					request_uri,
					'post',
					{
						data: { num: 'three' },
						type: 'text',
						success: function(r) {
							// continue adding to myQueue
							// Provide Success Method
							$('#queue-response').append("queueing five\n");
							myQueue.add(
								request_uri,
								'post',
								{
									data: { num: 'one' },
									type: 'text',
									success: function(r) {
										$('#queue-response').append('$.success - response: ' + r + "\n");
									}
								}
							);

							// Provide error method
							$('#queue-response').append("queueing six\n");
							myQueue.add(
								request_uri,
								'post',
								{
									data: { num: 'two' },
									type: 'text',
									error: function(r) {
										$('#queue-response').append('Error handled:');
										$('#queue-response').append('$.error - ' + r.status + ': ' + r.statusText + "\n");
									}
								}
							);

							// Provide Complete Method
							$('#queue-response').append("queueing seven\n");
							myQueue.add(
								request_uri,
								'post',
								{
									data: { num: 'three' },
									type: 'text',
									complete: function(r) {
										$('#queue-response').append('$.complete - responseText: ' + r.responseText + "\n");
									}
								}
							);
							$('#queue-response').append('$.success - response: ' + r + "\n");
						}
					}
				);
				
				// start a second concurrent queue
				theQueue = new ajaxQueue();
				$('#queue-response').append("queueing three\n");
				theQueue.add(
					request_uri,
					'post',
					{
						data: { num: '-one' },
						type: 'text',
						success: function(r) {
							$('#queue-response').append('$.success -- response: ' + r + "\n");
						}
					}
				);
				$('#queue-response').append("queueing four\n");
				theQueue.add(
					request_uri,
					'post',
					{
						data: { num: '-three' },
						type: 'text',
						success: function(r) {
							$('#queue-response').append('$.success -- response: ' + r + "\n");
						}
					}
				);
				
				// run
				theQueue.run();
				myQueue.run();
			});
		</script>
	</body>
</html>
