import { useEffect } from 'react';

import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';

import { api } from '@/trpc';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  api.todo.list.useQuery();
  const { mutateAsync: upload, data: uploadData } = api.todo.upload.useMutation(
    {
      onSuccess: (data) => {
        toast.success(`Uploaded ${data.name}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleUpload = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    upload(formData);
  };

  useEffect(() => {
    fetch('/api/health');
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          欢迎回家！
        </h1>
        <p className="text-lg text-gray-600">开始上传您的文件吧</p>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📁 选择文件
          </label>
          <div className="relative">
            <input
              type="file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:transition-all file:duration-200 file:cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-indigo-400 transition-colors duration-200"
              onChange={(e) =>
                handleUpload(
                  e.target.files?.[0] ??
                    new File([], 'test.pdf', { type: 'application/pdf' })
                )
              }
            />
          </div>
        </div>

        {uploadData && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h4 className="text-lg font-semibold text-green-800">上传成功</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-500 mb-1">文件名</p>
                <p className="font-medium text-gray-900 break-all">
                  {uploadData.name}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-500 mb-1">文件大小</p>
                <p className="font-medium text-gray-900">
                  {(uploadData.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-500 mb-1">文件类型</p>
                <p className="font-medium text-gray-900">{uploadData.type}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
