;(function() {
    function script() {
        // your main code here
        console.log('from foreground');
        //   console.log('window :', window._trfq);
        //_trfq & _expDataLayer
        console.log('window._trfq.dataLayerLog', window._trfq.dataLayerLog);
        const eventData = window._trfq.dataLayerLog;
        console.log('eventData from trfq', eventData);
        eventData.push(...window._expDataLayer.dataLayerLog);
        console.log('eventData from expDataLayer', eventData);
        eventData.map(event => {
            if(event.data && event.data.constructor === Array) {
                if(event.data[0].endsWith('Event')) {
                console.log('Event : ' + event.data[2], ', Timestamp : ' + event.timestamp);
                }
            }
            if(event.data && event.data.constructor === Object) {
                if(event.data.data && event.data.data.eid) {
                    console.log('Event : ' + event.data.data.eid, ', Timestamp : ' + event.timestamp);
                }
            }
        });
    }
  
    function inject(fn) {
      const script = document.createElement('script')
      script.text = `(${fn.toString()})();`
      document.documentElement.appendChild(script)
    }
  
    inject(script)
  })()