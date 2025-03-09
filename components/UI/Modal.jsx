import { View, Text, StyleSheet, Modal, Pressable, Image } from 'react-native';
import Colors from '../../constants/Colors';

const SuccessModal = ({ onPress, isModalOpen, logo, title, subTitle, buttonText  }) => {
  return (
    <Modal
      // animationType="fade"
      transparent
      visible={isModalOpen}
    >
      {/* Overlay: Close modal when clicking outside */}
      <Pressable 
        style={styles.modalOverlay} 
        onPress={onPress} // Close modal when clicking outside
      >
        {/* Modal content: Prevent closing when clicking inside */}
        <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logoStyle}
              source={logo}
            />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{ subTitle }</Text>
            
            <Pressable
              onPress={onPress}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.actionButtonText}>{ buttonText }</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: '72%',
    backgroundColor: 'white',
    paddingBottom: 14,
    borderRadius: 25,
    overflow: 'hidden',
    gap: 16,
  },
  logoContainer: {
    backgroundColor: Colors.MainColor,
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalContent: {
    paddingHorizontal: 50,
    alignItems: 'center',
    gap: 15,
  },
  modalText: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.black,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: Colors.MainColor,
    paddingVertical: 8,
    borderRadius: 14,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '500',
  },
});

export default SuccessModal;