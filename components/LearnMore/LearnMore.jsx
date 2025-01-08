import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './LearnMore.css';

const LearnMore = () => {
    return (
        <div className="learn-more">
            <div className="introduction">
                <div className="i-left">
                    <h1> What is Diabetic Retinopath</h1>
                    <p>Diabetic retinopathy is an eye condition that can cause vision loss and blindness in people who have diabetes. It affects blood vessels in the retina
                        (the light-sensitive layer of tissue in the back of your eye).If a person has diabetes, it’s important to get a comprehensive dilated eye exam at least once a year.
                        Diabetic retinopathy may not have any symptoms at first — but finding it early can help to take steps to protect one's vision.
                    </p>
                </div>
                <div className="i-right">
                    <img src="https://www.triglycerideforum.org/wp-content/uploads/2023/08/diabetic-retinopathy.jpg" alt="" />
                </div>
            </div>
            <div className="cause">
                <h2>What causes Diabetic Retinopathy and what other problems may arise?</h2>
                <p>Diabetic retinopathy is caused by high blood sugar due to diabetes. Over time, having too much sugar in your blood can damage your retina — the part of your eye
                    that detects light and sends signals to your brain through a nerve in the back of your eye (optic nerve).Diabetes damages blood vessels all over the body.
                    The damage to your eyes starts when the sugar in your blood causes changes to the tiny blood vessels that go to your retina. These changes make it harder
                    for the blood to flow, leading to blocked blood vessels that leak fluid or bleed. To make up for these blocked blood vessels, your eyes then grow new blood vessels
                    that don’t work well. These new blood vessels can leak or bleed easily.</p>
                <p>Diabetic retinopathy can lead to other serious eye conditions:</p>
                <ul>
                    <li><p><strong>Diabetic macular edema (DME).</strong>Over time, about 1 in 15 people with diabetes will develop DME. DME happens when blood vessels in the retina
                        leak fluid into the macula (a part of the retina needed for sharp, central vision). This causes blurry vision.</p></li>
                    <li><p><strong>Neovascular glaucoma.</strong>Diabetic retinopathy can cause abnormal blood vessels to grow out of the retina and block fluid from draining out of
                        the eye. This causes a type of glaucoma (a group of eye diseases that can cause vision loss and blindness).</p></li>
                    <li><p><strong>Retinal detachment.</strong>Diabetic retinopathy can cause scars to form in the back of your eye. When the scars pull your retina away from the back
                        of your eye, it’s called tractional retinal detachment.</p></li>
                </ul>
            </div>
            <div className="symptoms">
                <h2>What are the symptoms of Diabetic Retinopathy?</h2>
                <p>The early stages of diabetic retinopathy usually don’t have any symptoms. Some people notice changes in their vision, like trouble reading or seeing faraway objects.
                    These changes may come and go.In later stages of the disease, blood vessels in the retina start to bleed into the vitreous (gel-like fluid that fills your eye).
                    If this happens, you may see dark, floating spots or streaks that look like cobwebs. Sometimes, the spots clear up on their own — but it’s important to get
                    treatment right away. Without treatment, scars can form in the back of the eye. Blood vessels may also start to bleed again, or the bleeding may get worse.</p>
            </div>
            <div className="stage">
                <h1>Stages of Diabetic Retinopathy</h1>
                <p>Diabetic retinopathy is an eye disease that develops when high blood sugar damages the tiny fragile blood vessels in the retina of people living with diabetes.This
                    progressive eye disease may lead to blurred vision or even irreversible vision loss. Regular eye exams are important, because, by the time noticeable symptoms appear,
                    vision loss may have occurred. The sooner your eye doctor can diagnose diabetic retinopathy, the sooner you can take steps to slow its progression.There are two types of diabetic
                    retinopathy, which progresses in four stages.The two types of diabetic retinopathy are <strong>nonproliferative</strong> and <strong>proliferative</strong>.
                    Nonproliferative refers to the early stages of the disease, while proliferative is an advanced form of the disease.
                </p>
            </div>
            <div className="stage1">
                <div className="s-left">
                    <h2>Stage 1: Mild nonproliferative diabetic retinopathy</h2>
                    <p>This is the earliest stage of diabetic retinopathy, characterized by tiny swellings/bulges in the blood vessels of the retina. These areas of swelling are known
                        as microaneurysms.These microaneurysms can cause small amounts of fluid to leak into the retina, triggering swelling of the macula – the back of the retina.
                        Despite this, there are usually no clear symptoms indicating there is a problem.</p>
                    <h3>Treatment</h3>
                    <ul>
                        <li>No immediate medical intervention may be necessary.</li>
                        <li>Focus on strict blood sugar control, as well as managing blood pressure and cholesterol levels, to slow progression.</li>
                        <li>Regular eye exams (at least annually) to monitor changes.</li>
                    </ul>
                </div>
                <div className="s-right">
                    <img src="https://retinalscreenings.com/wp-content/uploads/2021/08/Mild-NPDR.png" alt="" />
                </div>


            </div>
            <div className="stage2">
                <div className="s2-left">
                    <img src="https://retinalscreenings.com/wp-content/uploads/2021/08/Moderate-NPDR-.png" alt="" />
                </div>
                <div className="s2-right">
                    <h2>Stage 2: Moderate nonproliferative diabetic retinopathy</h2>
                    <p>At this stage, the tiny blood vessels further swell up, blocking blood flow to the retina and preventing proper nourishment. This stage will only cause noticeable signs if there is a
                        build-up of blood and other fluids in the macula, causing vision to become blurry.</p>
                    <h3>Treatment</h3>
                    <ul>
                        <li>Anti-VEGF injections (e.g., ranibizumab or aflibercept): To reduce swelling and prevent further damage to the retina.</li>
                        <li>Laser photocoagulation therapy: May be used to seal leaking blood vessels.</li>
                        <li>Close monitoring with eye exams every 4–6 months.</li>
                    </ul>
                </div>
            </div>
            <div className="stage3">
                <div className="s3-left">
                    <h2>Stage 3: Severe nonproliferative diabetic retinopathy</h2>
                    <p>During this stage, a larger section of blood vessels in the retina becomes blocked, causing a significant decrease in blood flow to this area. The lack of blood triggers a signal to
                        the body to start growing new blood vessels in the retina.These new blood vessels are extremely thin and fragile and cause retinal swelling, resulting in noticeably blurry vision,
                        dark spots and even patches of vision loss. If these vessels leak into the macula, sudden and permanent vision loss may occur. At this stage, there is a high chance of irreversible
                        vision loss.</p>
                    <h3>Treatment</h3>
                    <ul>
                        <li><strong>Panretinal photocoagulation (PRP):</strong>A laser treatment that destroys oxygen-deprived retinal tissue, reducing signals for abnormal blood vessel growth.</li>
                        <li><strong>Anti-VEGF injections:</strong>To control macular edema if present and inhibit the formation of abnormal vessels.</li>
                        <li>Aggressive management of systemic risk factors like blood sugar and hypertension.</li>
                    </ul>
                </div>
                <div className="s3-right">
                    <img src="https://retinalscreenings.com/wp-content/uploads/2021/08/Severe-NPDR-.png" alt="" />
                </div>


            </div>
            <div className="stage4">
                <div className="s4-left">
                    <img src="https://retinalscreenings.com/wp-content/uploads/2021/08/Proliferative-Diabetic-Retinopathy.png" alt="" />
                </div>
                <div className="s4-right">
                    <h2>Stage 4: Proliferative diabetic retinopathy</h2>
                    <p>At this advanced stage of the disease, new blood vessels continue to grow in the retina. These blood vessels, which are thin and weak and prone to bleeding, cause scar tissue to form
                        inside the eye. This scar tissue can pull the retina away from the back of your eye, causing retinal detachment. A detached retina typically results in blurriness, reduced field of
                        vision, and even permanent blindness.</p>
                    <h3>Treatment</h3>
                    <ul>
                        <li><strong>Vitrectomy:</strong>A surgical procedure to remove blood from the vitreous or scar tissue pulling on the retina.</li>
                        <li><strong>Panretinal photocoagulation (PRP):</strong>To shrink abnormal blood vessels.</li>
                        <li><strong>Anti-VEGF injections:</strong>Used in combination with other treatments to control abnormal vessel growth and reduce macular edema.</li>
                        <li>Intensive control of blood sugar, blood pressure, and cholesterol to prevent further complications.</li>
                    </ul>
                </div>
            </div>
            <div className="fundus">
                <h1>How Fundus Image help detects Diabetic Retinopathy?</h1>
                <p>A fundus image is a detailed photograph of the retina, captured using fundoscopy, which highlights key structures like the retina, optic disc, macula, and blood vessels. It is essential
                    for diagnosing diabetic retinopathy (DR) by revealing abnormalities caused by diabetes, such as microaneurysms, hemorrhages, exudates, and cotton-wool spots. These signs indicate early
                    to advanced stages of DR, including vascular damage and fluid leakage, leading to complications like diabetic macular edema (DME).</p>
                <p>A fundus image helps detect diabetic retinopathy (DR) by providing a detailed view of the retina, highlighting abnormalities caused by diabetes. It reveals microaneurysms (early signs of
                    DR), hemorrhages (blood leakage from damaged vessels), and exudates (lipid or protein deposits from vessel leaks). Advanced stages show neovascularization (abnormal blood vessel growth)
                    and cotton-wool spots (nerve fiber damage).By identifying these changes, fundus imaging aids in diagnosing DR at various stages, from mild to proliferative. It also detects diabetic
                    macular edema (DME), a leading cause of vision loss. Non-invasive and effective, fundus imaging supports early detection, timely treatment, and monitoring of disease progression to
                    prevent vision impairment.</p>
            </div>
            <div className="model-working">
                <h1>How does our Model helps to detect Diabetic Retinopathy?</h1>
                <p>Diabetic retinopathy is a retinal disease caused by diabetes that can lead to vision loss if not detected and treated early. Detecting this condition involves analyzing fundus images to
                    identify abnormalities such as microaneurysms, hemorrhages, and exudates. The provided code demonstrates a comprehensive pipeline to preprocess and prepare fundus images for a deep
                    learning model to classify diabetic retinopathy severity. By enhancing raw images and feeding them into a trained model, this system supports early detection and clinical decision-making.</p>
                <h3>Preprocessing Steps</h3>
                <p>The preprocessing pipeline ensures that the fundus images are consistent and optimized for analysis. The Fundus ROI Extraction module isolates the retina by extracting the green
                    channel, which offers better contrast for retinal features, applying thresholding to separate the retina from the background, and performing morphological operations to remove noise.
                    The ROI is resized for uniformity, and irrelevant regions are masked to focus only on the essential features. Illumination Equalization normalizes pixel intensity to correct
                    lighting variations, while Histogram Equalization enhances contrast to highlight retinal features. Additionally, Adaptive Histogram Equalization (CLAHE) further enhances localized
                    contrast, making abnormalities like microaneurysms and hemorrhages more visible. These preprocessing steps ensure that the retinal features necessary for detecting
                    diabetic retinopathy are clearly highlighted and consistent across images.</p>
                <h3>TFRecord Serialization</h3>
                <p>Once the preprocessing is complete, the images are serialized using the TFRecord format for efficient storage and integration with TensorFlow-based models. During this process,
                    preprocessed images are encoded as JPEGs and serialized with metadata, creating compact and structured data records. When the model processes the data, the TFRecord class decodes
                    the records, resizes the images to a standard size (e.g., 224x224), and normalizes pixel values to a 0–1 range. This format enables efficient data handling and ensures
                    compatibility with large-scale machine learning workflows.</p>
                <h3>Model Integration</h3>
                <p>Finally, the preprocessed and serialized images are passed into a deep learning model, likely a convolutional neural network (CNN). This model extracts features such as
                    microaneurysms, hemorrhages, exudates, and blood vessel irregularities, which are critical indicators of diabetic retinopathy. It then classifies the severity of the condition
                    into categories such as no retinopathy, mild, moderate, severe, or proliferative stages. By automating the analysis of retinal images and providing accurate classifications,
                    this system aids clinicians in diagnosing the disease early and planning appropriate treatments, ensuring better outcomes for patients.</p>
            </div>
        </div>

    );
};

export default LearnMore;