import FormLineLayout from './components/FormLineLayout';

class FileInput extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    name: PropTypes.string.isRequired,

    formState: PropTypes.object.isRequired,
    updateFormState: PropTypes.func.isRequired,

    formValidation: PropTypes.object.isRequired,

    accept: PropTypes.string,
    onFileSelected: PropTypes.func,
    currentFileUrl: PropTypes.string,
    previewSize: PropTypes.number
  }

  static defaultProps = {
    accept: 'image/*',
    onFileSelected: () => {},
    currentFileUrl: null,
    previewSize: 80
  }

  handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update form state with the file
      this.props.updateFormState({
        ...this.props.formState,
        [this.props.name]: file
      });
      
      // Call optional callback
      this.props.onFileSelected(file);
    }
  }

  renderPreview = () => {
    const { currentFileUrl, previewSize } = this.props;
    const file = this.props.formState[this.props.name];
    
    // Show preview if we have a current URL or a selected file
    if (currentFileUrl || file) {
      let previewUrl = currentFileUrl;
      
      // If a new file is selected, show preview of that file
      if (file && file instanceof File) {
        previewUrl = URL.createObjectURL(file);
      }
      
      return (
        <div className="file-preview">
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ 
              width: previewSize, 
              height: previewSize, 
              objectFit: 'cover',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }} 
          />
        </div>
      );
    }
    
    return null;
  }

  triggerFileInput = () => {
    const fileInput = document.getElementById(this.props.name);
    if (fileInput) {
      fileInput.click();
    }
  }

  render = () => {
    const file = this.props.formState[this.props.name];
    
    return (
      <FormLineLayout
        label={this.props.label}
        name={this.props.name}
        formValidation={this.props.formValidation}
      >
        <div className="file-input-container">
          <div className="file-input-wrapper">
            {/* Hidden file input */}
            <input
              type="file"
              id={this.props.name}
              accept={this.props.accept}
              onChange={this.handleFileChange}
              style={{ display: 'none' }}
            />
            
            {/* Custom button */}
            <button
              type="button"
              className="button -white file-input-button"
              onClick={this.triggerFileInput}
            >
              Choose File
            </button>
          </div>

          {this.renderPreview()}
        </div>
      </FormLineLayout>
    )
  }
}

export { FileInput };
export default FileInput;