import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ImageCroppedEvent, ImageTransform, LoadedImage } from 'ngx-image-cropper';
import { IItem } from 'src/domain/model/IItem';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {
  @Input() accept: string = 'image/*';
  @Output() fileSelected = new EventEmitter<File>();
  @Input() selectedFilePreview: string | undefined;
  @Input() withItemPreview: string | undefined;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  transform: ImageTransform = {};
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  containWithinAspectRatio = false;
  @Input() aspectRatio = 1/1;

  mockCardData = {
    title: 'Preview Card',
    description: 'This is how your image will look in the card component',
    illustration: ''
  };

  mockItemData: IItem = {
    itemId: 'preview',
    name: 'Preview Item',
    price: 9.99,
    type: 'preview',
    ingredients: ['ingredient 1', 'ingredient 2'],
    illustration: '',
    description: 'This is how your image will look in the item component'
  };

  imageCropped(event: ImageCroppedEvent) {
    console.log('imageCropped', event);
    console.log('event.objectUrl', event.objectUrl);
    this.croppedImage = event.objectUrl;
  }

  imageLoaded(image: LoadedImage) { }
  cropperReady() { }
  loadImageFailed() { }

  closeCropper() {
    this.showCropper = false;
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  confirmCrop() {
    if (this.croppedImage) {
      this.selectedFilePreview = this.croppedImage;
      this.updateMockData();

      fetch(this.croppedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'cropped_image.png', { type: 'image/png' });
          this.fileSelected.emit(file);
        });
    }
    this.showCropper = false;
    this.imageChangedEvent = '';
  }

  openBoxForChooseFile(input: HTMLInputElement): void {
    input.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imageChangedEvent = event;
      this.showCropper = true;
    }
  }

  removeSelectedFile(event: Event): void {
    event.stopPropagation();
    this.selectedFilePreview = undefined;
    this.fileSelected.emit();
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  private updateMockData() {
    if (this.selectedFilePreview) {
      this.mockItemData = {
        ...this.mockItemData,
        illustration: this.selectedFilePreview
      };
      this.mockCardData = {
        ...this.mockCardData,
        illustration: this.selectedFilePreview
      };
    }
  }
}
