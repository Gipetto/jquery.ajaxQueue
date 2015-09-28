;(function($){
	/**
	 * ajaxQueue - simple jQuery queueing for Ajax requests
	 *
	 * @version 0.1
	 * @requries jQuery 1.4.x or later (might work on earlier verions, I didn't bother to test)
	 * @author Shawn Parker (shawn at topfroggraphics dot com)
	 */
	ajaxQueue = function() {
		/**
		 * Request object
		 * Handles the abstraction of ajax 'complete' method for running in the queue
		 * @see aQueue.add for param usage
		 */
		var aRequest = function(url, method, opts) {
			this.opts = opts || {};
			this.opts.url = url;
			this.opts.method = method || 'get';

			var _complete = this.opts.complete || function() {};
			this.opts.complete = function(r) {
				_complete(r);
				_aQueue.dequeue('requests');
			};
		};

		/**
		 * aRequest.call - perform ajax request
		 */
		aRequest.prototype.call = function() {
			$.ajax(this.opts);
		};

		/**
		 * Qeueue object init
		 */
		var _aQueue = $({});

		/**
		 * Add an empty .complete() function on the queue object
		 */
		_aQueue.complete = function(){};

		/**
		 * Add to queue
		 *
		 * @param string url - ajax request uri
		 * @param string method - http method of ajax request, 'post' or 'get'
		 * @param object opts - standard jQuery Ajax request opts. See: http://api.jquery.com/jQuery.ajax/
		 */
		this.add = function(url, method, options) {
			_aQueue.queue('requests', function() {
				var request = new aRequest(url, method, options);
				request.call();
			});
		};

		/**
		 * run queue
		 */
		this.run = function() {
			_aQueue.dequeue('requests');
		};

		/**
		 * flush queue
		 */
		this.flush = function() {
			_aQueue.queue('requests', []);
		};
	};	
})(jQuery);