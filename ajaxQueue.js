/**
 * ajaxQueue - simple jQuery queueing for Ajax requests
 *
 * @version 0.1
 * @requries jQuery 1.4.x or later (might work on earlier verions, I didn't bother to test)
 * @author Shawn Parker (shawn at topfroggraphics dot com)
 */
var ajaxQueue = function() {
	/**
	 * Qeueue object init
	 */
	var _aQueue = $({});
	/**
	 * Add to queue
	 *
	 * @param string url - ajax request uri
	 * @param string type - type of ajax request, 'post' or 'get'
	 * @param object opts - standard jQuery Ajax request opts. See: http://api.jquery.com/jQuery.ajax/
	 */
	this.add = function(url, type, options) {
		_aQueue.queue('requests', function() {
			var request = new aRequest(url, type, options);
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

	/**
	 * Request object
	 * Handles the abstraction of ajax 'complete' method for running in the queue
	 * @see aQueue.add for param usage
	 */
	var aRequest = function(url, type, opts) {
		this.opts = opts || {};
		this.opts.url = url;
		this.opts.type = type || 'get';

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
};