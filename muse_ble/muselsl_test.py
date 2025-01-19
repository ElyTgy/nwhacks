from muselsl import stream, list_muses

muses = list_muses()
stream(muses[0]['address'])

# Note: Streaming is synchronous, so code here will not execute until after the stream has been closed
print('Stream has ended')

# """Example program to show how to read a multi-channel time series from LSL."""
# from pylsl import StreamInlet # first resolve an EEG # stream on the lab network
# from pylsl.resolve import resolve_stream
# print("looking for an EEG stream...")
# streams = resolve_stream('type', 'EEG') # create a new inlet to read # from the stream
# inlet = StreamInlet(streams[0])
# while True:    
# # get a new sample (you can also omit the timestamp part if you're 
# # not interested in it)    
#   sample, timestamp = inlet.pull_sample()    
#   print(timestamp, sample)

