import { View, Text, StyleSheet, Modal, Pressable, Image } from 'react-native';
import Colors from '../../constants/Colors';
import PrimaryButton from './PrimaryButton';

const MainModal = ({
    onPress,
    isModalOpen,
    logo,
    subTitle,
    buttonText,
    backgroundColor,title,
    titleColor,
    secondButtonText,
    colordWord,
}) => {
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
          <View style={[styles.logoContainer, { backgroundColor }]}>
            <Image
              style={styles.logoStyle}
              source={logo}
            />
          </View>

          <View style={styles.modalContent}>
            { title && (
              <Text style={[styles.modalTitle, { color: titleColor }]} >
                {title}
              </Text>
            )}
            
            <Text style={styles.modalText}>
              { subTitle }
              { colordWord && <Text style={styles.coloredWord}>{colordWord}</Text> }
            </Text>

            <View style={styles.buttonsContainer}>
              { buttonText && (
                <PrimaryButton
                  onPress={onPress}
                  backgroundColor={backgroundColor}
                  title={buttonText}
                  textColor={Colors.white}
                  style={{ height: 46, borderRadius: 12, }}
                />
              )}
              

              { secondButtonText && (
                <PrimaryButton
                  onPress={onPress}
                  title={secondButtonText}
                  textColor={Colors.red700}
                  style={{ height: 46, borderRadius: 12, borderWidth: 4, borderColor: Colors.red700 }}
                />
              )}
            </View>
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
    width: '75%',
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
    paddingHorizontal: 30,
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  modalText: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.black,
    textAlign: 'center',
  },
  coloredWord: {
    color: Colors.MainColor,
    fontWeight: '600',
  },
  buttonsContainer: {
    marginTop: 4,
    alignSelf: 'stretch',
    gap: 6,
  },
});

export default MainModal;


{/* Warning */}
{/* <MainModal
  onPress={() => {}}
  isModalOpen={true}
  logo={require("./assets/Images/WarningIcon.png")}
  backgroundColor={Colors.yellow700}
  subTitle="By cancelling you will have to accept it later if you want to use our app properly."
  title="Warning!"
  titleColor={Colors.black}
/> */}

{/* password changed */}
{/* <MainModal
  onPress={() => {}}
  isModalOpen={true}
  logo={require("@/assets/Images/lets-icons_done-ring-round.png")}
  subTitle="Your password was reset successfully."
  backgroundColor={Colors.MainColor}
  buttonText="Done"
/> */}

{/* report is done */}
{/* <MainModal
  onPress={() => {}}
  isModalOpen={true}
  logo={require("./assets/Images/error-modal.png")}
  backgroundColor={Colors.red700}
  subTitle="Thanks for your report we will review the record we have and take care of this case."
/> */}

{/* report */}
{/* <MainModal
  onPress={() => {}}
  isModalOpen={true}
  logo={require("./assets/Images/error-modal.png")}
  backgroundColor={Colors.red700}
  subTitle="Thanks for your report we will review the record we have and take care of this case."
  buttonText="Report Call"
  secondButtonText="No, Thank you"
/> */}

{/* Sorry */}
{/* <MainModal
  onPress={() => {}}
  isModalOpen={true}
  logo={require("./assets/Images/Sorry-modal.png")}
  backgroundColor={Colors.MainColor}
  subTitle="No one is available right now try again later or try to use our AI feature, "
  colordWord="My Vision"
  title="Sorry :("
  titleColor={Colors.MainColor}
/> */}