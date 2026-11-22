import { PlusOutlined } from "@ant-design/icons";
import { App, Upload, type UploadFile } from "antd";
import { ACCEPTED_IMAGE_TYPES, isAcceptedImage } from "@/utils/images";

interface ImageUploadFieldProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
  /** Maximum number of images; omit for no limit. With 1, a new pick replaces the current one. */
  maxCount?: number;
}

/** Image picker for antd forms. Files stay in the browser until the form is saved. */
export function ImageUploadField({ value = [], onChange, maxCount }: ImageUploadFieldProps) {
  const { message } = App.useApp();
  const canAddMore = maxCount === undefined || maxCount === 1 || value.length < maxCount;

  return (
    <Upload
      listType="picture-card"
      accept={ACCEPTED_IMAGE_TYPES.join(",")}
      multiple={maxCount !== 1}
      maxCount={maxCount}
      fileList={value}
      beforeUpload={(file) => {
        if (!isAcceptedImage(file)) {
          message.error(`${file.name} is not a JPG or PNG image.`);
          return Upload.LIST_IGNORE;
        }
        // Keep the file locally; it is sent when the form is saved.
        return false;
      }}
      onChange={({ fileList }) => onChange?.(fileList)}
    >
      {canAddMore && (
        <button type="button" style={{ border: 0, background: "none", cursor: "pointer" }}>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>
            {maxCount === 1 && value.length ? "Replace" : "Add image"}
          </div>
        </button>
      )}
    </Upload>
  );
}
