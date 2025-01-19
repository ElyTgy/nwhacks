from muselsl import stream, list_muses

muses = list_muses()
stream(muses[0]['address'])

# Note: Streaming is synchronous, so code here will not execute until after the stream has been closed
print('Stream has ended')