// 画像回転処理
export const rotateImage = (file: File, angle: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;
      img.src = e.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not found");

      const radians = (angle * Math.PI) / 180;

      // 90° or 270° の場合は縦横を入れ替える
      if (angle % 180 !== 0) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      // 中心を基準に回転
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      canvas.toBlob((blob) => {
        if (!blob) return reject("Blob conversion failed");
        const rotated = new File([blob], file.name, { type: file.type });
        resolve(rotated);
      }, file.type);
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
};
