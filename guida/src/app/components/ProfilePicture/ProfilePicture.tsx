import styles from "./ProfilePicture.module.css";

interface ProfilePictureProps {
  imageUrl: string;
}

const ProfilePicture: React.FC<ProfilePictureProps>  = ({
    imageUrl,
  }) => {

    return (
        <img
            src={imageUrl}
            className={styles.profilePicture}
            alt="Profile"
            />
      );
    }
    
    export default ProfilePicture;