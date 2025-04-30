$models = @(
    @{
        url = "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-weights_manifest.json"
        output = "public/models/tiny_face_detector_model-weights_manifest.json"
    },
    @{
        url = "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-shard1"
        output = "public/models/tiny_face_detector_model-shard1"
    },
    @{
        url = "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-weights_manifest.json"
        output = "public/models/face_expression_model-weights_manifest.json"
    },
    @{
        url = "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-shard1"
        output = "public/models/face_expression_model-shard1"
    }
)

foreach ($model in $models) {
    Write-Host "Downloading $($model.url)"
    Invoke-WebRequest -Uri $model.url -OutFile $model.output
}
