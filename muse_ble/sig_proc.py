import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import butter, lfilter, spectrogram

def filtering(eeg_array, lowcut, highcut):
    # Butterworth filter order
    order = 5

    # Nyquist frequency
    nyq = 0.5 * 256

    # Low and high pass filter coefficients
    low = lowcut / nyq
    high = highcut / nyq

    # Apply bandpass filter to each channel
    filtered_eeg = []
    for channel_data in eeg_array:
        b, a = butter(order, [low, high], btype='band')
        filtered_channel = lfilter(b, a, channel_data)
        filtered_eeg.append(filtered_channel)

    return np.array(filtered_eeg)

def spec_array(eeg_array, n_fft=256, overlap=0):
    fs = 256  # Sampling frequency

    # Parameters for spectrogram
    window = 'hann'

    # List to store spectrograms
    spectrograms = []

    # Generate spectrogram for each channel
    for channel_data in eeg_array:
        f, t, Sxx = spectrogram(channel_data, fs, window=window, nperseg=n_fft, noverlap=overlap, scaling='density')
        spectrograms.append(Sxx)

    # Convert to 3D array: [channels, freq_bins, time_bins]
    spectrograms = np.array(spectrograms)

    # Average spectrogram across channels
    avg_spectrogram = np.mean(spectrograms, axis=0)
    # log scale
    avg_spectrogram = 10 * np.log10(avg_spectrogram)
    return avg_spectrogram, f, t

def bandpowers(spectrogram, freqs):
    # Define frequency bands
    bands = {
        'delta': (0.5, 4),
        'theta': (4, 8),
        'alpha': (8, 12),
        'beta': (12, 30)
    }

    # Dictionary to store band power
    band_power = {band: [] for band in bands.keys()}

    for ts in range(spectrogram.shape[1]):
        # Calculate band power for each frequency band
        for band, (low, high) in bands.items():
            # Get indices for the frequency band
            band_idx = np.where((freqs >= low) & (freqs < high))[0]

            # Ensure band_idx is not empty
            if band_idx.size > 0:
                # Calculate the mean power within the band at the given time index
                # band_power[band] = np.mean(spectrogram[band_idx, ts])
                band_power[band].append(np.mean(spectrogram[band_idx, ts]))
            else:
                # band_power[band] = 0  # Set to 0 if no frequencies in the band
                band_power[band].append(0)

    return band_power


