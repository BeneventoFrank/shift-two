<template>
    <div v-if="gridSettings.developmentMode.Enabled" class='fade-in' style="display:flex; flex-direction:row; box-shadow: 0px 0px 27px -13px black; min-width:600px; position:absolute; z-index:10000; justify-content:center; ">
        <div style="border-radius:5px; background-color:#F8F8F8; min-width:600px; max-width:600px; height:380px; border:1px solid grey; ">
            <div style="height:5%; border-top-right-radius:5px; border-top-left-radius:5px; background-color:#577594; display:flex;flex-direction:row; justify-content:center;">
                <span style="color:white;">{{developerModeText}}</span>
            </div>
            <div style="height:93%; display:flex;flex-direction:row; justify-content:center;">
                <div style="width:25%; display:flex; flex-direction:column;">
                    <div @click="setCurrentTab('welcome')" class='tab' :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='welcome'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='welcome'?'#f2ecdc':'slateGrey'}; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex;`"><span style="width:100%">Welcome</span></div>
                    <div @click="setCurrentTab('size')" class='tab' :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='size'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='size'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Size</span></div>
                    <div @click="setCurrentTab('title')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='title'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='title'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Title</span></div>
                    <div @click="setCurrentTab('header')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='header'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='header'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Header</span></div>
                    <div @click="setCurrentTab('rows')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='rows'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='rows'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Rows</span></div>
                    <div @click="setCurrentTab('columns')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='columns'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='columns'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Columns</span></div>
                    <div @click="setCurrentTab('paging')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='paging'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='paging'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Slider/Paging</span></div>
                    <div @click="setCurrentTab('slots')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='slots'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='slots'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Slots/Events</span></div>
                    <div @click="setCurrentTab('generate')" class='tab'  :style="`box-shadow: 0 6px 5px -8px black; cursor:pointer; background-color:${currentTab==='generate'?'#f2ecdc':'#dbd9d3'}; border-right:1px solid ${currentTab==='generate'?'#f2ecdc':'slateGrey'}; slateGrey; height:35px; width:100%; border-bottom:1px solid slateGrey; display:flex; ;`"><span style="width:100%">Generate Config</span></div>
                    <div :style="`background-color:#dbd9d3; border-right:1px solid slateGrey;flex-grow:1;`">
                    </div>
                </div>
                <div v-show="currentTab==='welcome'" style="width:75%; background-color:#f2ecdc; padding:20px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <span style="padding-bottom:40px; font-size:20px;">Welcome to the grid configuration tool.</span>
                    <span style="padding-bottom:20px; font-size:14px;">Use the tabs on the left to configure your grid exactly as you want it. When you are done, use the <b>Generate Config</b> tab to download your settings.</span>
                    <span style="padding-bottom:20px; font-size:14px;">You may re-open this tool at any point by turning on developmentMode in your config</span>
                    <span style="font-size:14px; ">Thanks for picking Shift-Grid, tell us what you think. </span>
                    <span style="font-size:14px; "><a href='www.shift-two.com'>www.shift-two.com</a></span>
                    
                </div>
                <div v-show="currentTab==='size'" style="width:75%; padding:35px; background-color:#f2ecdc; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:flex-end;">
                                <div style="width:100px; display:flex; justify-content:flex-start"><span class="mediumText">Grid Width</span></div>
                                <div><input @input="debounceInput" v-model="devModeWidthValue"  type='number' style="width:75px" height="30px"><span class='smallerText'> px</span></div>
                            </div>    
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:flex-end; margin-top:15px;">
                                <div style="width:100px; display:flex; justify-content:flex-start"><span class="mediumText">Grid Height</span></div>
                                <div><input type='number' @input="debounceHeightInput" v-model="devModeHeightValue" style="width:75px" height="30px"><span class='smallerText'> px</span></div>
                            </div>   
                        </div>
                    </div>
                </div>                
                <div v-show="currentTab==='title'" style="width:75%; padding:35px; background-color:#f2ecdc; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:flex-start;">
                        <div style="display:flex; width:100%; justify-content:flex-start;">
                            <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Enable Title</span></div>
                            <div>
                                <input type="checkbox" @change="(event)=>{handleUpdateGridSettings(chkEnableTitle,'title','Enabled')}" v-model="chkEnableTitle" id="enableTitle" name="enableTitle" value="true">
                            </div>
                        </div>       
                        <div style="display:flex; width:100%; margin-top:15px; align-items:flex-end;">
                            <div style="width:150px; display:flex;justify-content:flex-start;"><span class="mediumText">Grid Title</span></div>
                            <div style="width:150px; display:flex;justify-content:flex-start;"><input @input="(event)=> handleUpdateGridSettings(event.target.value,'title','Text')" type='text' v-model="titleText" style='width:100%'></div>
                        </div>                        
                        <div style="display:flex; width:100%; justify-content:flex-start; align-items:center; margin-top:15px;">
                            <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Title Color</span></div>
                            <div style='display:flex;  align-items:center;'>
                                <input @input="(event)=>{debounceColorChange(event,'GridTitleColor')}" v-model="localActiveColorScheme.gridTitleColor"  type='text' style="width:100px" height="30px">
                                <input type='color' @input="(event)=>{handleColorPickerChange(event,'GridTitleColor')}" class='colorPicker' :value='localActiveColorScheme.gridTitleColor'>
                            </div>
                        </div>    
                    </div>
                </div>
                <div v-show="currentTab==='header'" style="width:75%; background-color:#f2ecdc; display:flex; flex-direction:column; padding:35px; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Enable Header Row</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input type="checkbox" @change="(event)=>handleUpdateGridSettings(chkEnableHeader,'header','Enabled')" v-model="chkEnableHeader" id="enableHeader" name="enableHeader" value="true">                                    
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Grid Header Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'GridHeaderBackgroundColor')}" v-model="localActiveColorScheme.gridHeaderBackgroundColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'GridHeaderBackgroundColor')}" class='colorPicker' :value='localActiveColorScheme.gridHeaderBackgroundColor'>
                                </div>
                            </div>  
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center; margin-top:10px;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Grid Header Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'GridHeaderTextColor')}" v-model="localActiveColorScheme.gridHeaderTextColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'GridHeaderTextColor')}" class='colorPicker' :value='localActiveColorScheme.gridHeaderTextColor'>
                                </div>

                            </div>  
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Flyout Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'FlyoutBackgroundColor')}" type='text' style="width:100px" height="30px" v-model="localActiveColorScheme.flyoutBackgroundColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'FlyoutBackgroundColor')}" class='colorPicker' :value='localActiveColorScheme.flyoutBackgroundColor'>
                                </div>

                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Flyout Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'FlyoutTextColor')}" type='text' style="width:100px" height="30px" v-model="localActiveColorScheme.flyoutTextColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'FlyoutTextColor')}" class='colorPicker' :value='localActiveColorScheme.flyoutTextColor'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;  align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Active Indicator Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'ActiveIndicatorColor')}" v-model="localActiveColorScheme.activeIndicatorColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'ActiveIndicatorColor')}" class='colorPicker' :value='localActiveColorScheme.activeIndicatorColor'>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='rows'" style="width:75%; display:flex; padding:35px; background-color:#f2ecdc; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Even Row Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'GridRowEvenBackgroundColor')}" type='text' style="width:100px" height="30px" v-model="localActiveColorScheme.gridRowEvenBackgroundColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'GridRowEvenBackgroundColor')}" class='colorPicker' :value='localActiveColorScheme.gridRowEvenBackgroundColor'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Odd Row Background Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'GridRowOddBackgroundColor')}" type='text' style="width:100px" height="30px" v-model="localActiveColorScheme.gridRowOddBackgroundColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'GridRowOddBackgroundColor')}" class='colorPicker' :value='localActiveColorScheme.gridRowOddBackgroundColor'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Row Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'GridRowTextColor')}" type='text' style="width:100px" height="30px" v-model="localActiveColorScheme.gridRowTextColor">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'GridRowTextColor')}" class='colorPicker' :value='localActiveColorScheme.gridRowTextColor'>
                                </div>
                            </div>   
                            <br>
                            <hr style='width:100%;'>
                            <br>
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Enable Row Highlight </span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input type="checkbox" @change="()=>handleUpdateGridSettings(chkEnableHighlight,'rows','HighlightRowEnabled')" v-model="chkEnableHighlight" id="enableHeader" name="enableHeader" value="true">                                    
                                </div>
                            </div>
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Row Highlight Background</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'RowHighlightBackground')}" type='text' style="width:100px" height="30px" v-model="localActiveColorScheme.rowHighlightBackground">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'RowHighlightBackground')}" class='colorPicker' :value='localActiveColorScheme.rowHighlightBackground'>
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px; align-items:center;">
                                <div style="width:250px; display:flex; justify-content:flex-start"><span class='mediumText'>Row Highlight Active Cell</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'RowHighlightActiveCell')}" type='text' style="width:100px" height="30px" v-model="localActiveColorScheme.rowHighlightActiveCell">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'RowHighlightActiveCell')}" class='colorPicker' :value='localActiveColorScheme.rowHighlightActiveCell'>
                                </div>
                            </div>   
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='columns'" style="width:75%; padding-left:30px; padding-right:30px; padding-top:15px; padding-bottom:15px; display:flex; flex-direction:column; align-items:flex-start; background-color:#f2ecdc; justify-content:flex-start;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; flex-direction:row; align-items:center; justify-content:flex-start; align-items:center;">
                                <span style="margin-right:15px;" class="mediumText">Number Of Columns</span>
                                <input type="number" id="quantity" @change="handleColNumChange" name="quantity" v-model="numColumns" min="1" max='25' style="width:45px" height="30px">
                            </div>
                            <div style='width:100%; margin-top:15px; display:flex; flex-direction:row; align-items:center; justify-content:flex-start;'>
                                <label style="margin-right:36px;" for="columns" class="mediumText">Choose a column</label>
                                <select @change="handleColumnEdit" style="width:200px;" name="columns" id="columns">
                                    <option :value="-1">Select To Edit</option>
                                    <option v-for="(column, index) in gridSettings.columns" :key="index" :value="index">{{`header - ${column.ColumnHeader}`}}</option>
                                </select>                                
                            </div>
                            <div :style="`display:flex; flex-direction:column; width=100%; margin-top:15px; margin-bottom:10px; justify-content:center; align-items:center`">
                                    <span class="smallerText">{{`Available for customizing: ${availableForCustomizing}px`}}</span>
                            </div>
                            <div v-if="showWidthError" style='width:100%;'>
                                <span class="mediumText" style='color:red'>{{`Custom width over Max, max=${availableForCustomizing} px`}}</span>
                            </div>
                            <div v-else><br></div>
                            <hr v-show="columnSelected!==-1" style="width:100%; margin-bottom:10px; height:1px;">
                            <div v-show="columnSelected!==-1" style='width:100%; display:flex; flex-direction:column; align-items:center;'>
                                <div style="display:flex; width:100%;">
                                    <div style="width:50%; height:16px; display:flex;justify-content:flex-start;"><span class="mediumText">Column Header</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;"><input @input="(event)=>handleUpdateGridColumns(event,'ColumnHeader')" type='text' v-model="localActiveColumnEdit.ColumnHeader" style='width:50%'></div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:10px;">
                                    <div style="width:50%; height:16px; display:flex;justify-content:flex-start;"><span class="mediumText">Use Custom Component?</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <input @change="handleIsCustomComponent" v-model="localActiveColumnEdit.IsUsingCustomComponent" style="margin:0;" type="checkbox">
                                    </div>
                                </div>
                                <div v-show="localActiveColumnEdit.IsUsingCustomComponent" style="display:flex; width:100%; margin-top:10px;">
                                    <div style="width:50%; height:16px; display:flex;justify-content:flex-start;"><span class="mediumText">Select The Component</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <select @change="(event)=>handleUpdateGridColumns(event,'CustomComponentName')" style="width:200px;" name="columns" id="columns">
                                            <option :value="``">Select Component</option>
                                            <option v-for="(comp, index) in componentList" :key="index" :value="comp.name">{{comp.name}}</option>
                                        </select>                                                                      
                                    </div>
                                </div>
                                <div style="display:flex; width:100%; margin-top:10px;">
                                    <div style="width:50%; height:16px; display:flex;justify-content:flex-start;"><span class="mediumText">Custom Width</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start; align-items:center;">
                                        <input @input="debounceHandleCustomWidth" type='number' min="0" v-model="localActiveColumnEdit.WidthValue" style='width:100px;'><span class='smallerText'> px</span>
                                        <span style="margin-left:10px; margin-right:10px;" class="mediumText">auto</span><input @change="handleAutoSize" v-model="localActiveColumnEdit.ChkAuto" style="margin:0;" type="checkbox" id="enablePresort" name="enablePresort" value="true">
                                    </div>
                                </div>
                                <div v-show="!localActiveColumnEdit.IsUsingCustomComponent" style="display:flex; width:100%; margin-top:10px;">
                                    <div style="width:50%; height:16px; display:flex;justify-content:flex-start;"><span class="mediumText">Data Alignment</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <select @input="(event)=>handleUpdateGridColumns(event,'Alignment')" v-model="localActiveColumnEdit.Alignment" style="width:100px;" name="alignment" id="alignment">
                                            <option value='flex-start'>left</option>
                                            <option value='center'>center</option>
                                            <option value='flex-end'>right</option>
                                        </select>                                        
                                    </div>
                                </div>
                                <div v-show="!localActiveColumnEdit.IsUsingCustomComponent" style="display:flex; width:100%; margin-top:10px;">
                                    <div style="width:50%; height:16px; display:flex;justify-content:flex-start;"><span class="mediumText">Data Type</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <select @input="(event)=>handleUpdateGridSettings(event.target.value,'DataType')" v-model="localActiveColumnEdit.DataType" style="width:100px;" name="dataType" id="dataType">
                                            <option value='string'>string</option>
                                            <option value='number'>number</option>
                                        </select>                                        
                                    </div>
                                </div>
                                <div v-show="!localActiveColumnEdit.IsUsingCustomComponent" style="display:flex; width:100%; margin-top:10px;">
                                    <div style="width:50%; height:16px; display:flex;justify-content:flex-start;"><span class="mediumText">Enable Pre-sort</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <input @change="(event)=>handleUpdateGridColumns(event,'IsPreSortEnabled')" v-model="localActiveColumnEdit.IsPreSortEnabled" style="margin:0;" type="checkbox" id="enablePresort" name="enablePresort" value="true">
                                    </div>
                                </div>
                                <div v-show="!localActiveColumnEdit.IsUsingCustomComponent" style="display:flex; width:100%; margin-top:10px;">
                                    <div style="width:50%; height:16px; display:flex;justify-content:flex-start;"><span class="mediumText">Component To Show On Click</span></div>
                                    <div style="width:50%; display:flex;justify-content:flex-start;">
                                        <select @change="(event)=>handleUpdateGridColumns(event,'OnCellClick')" style="width:200px;">
                                            <option :value="``">Select Component</option>
                                            <option v-for="(comp, index) in componentList" :key="index" :value="comp.name">{{comp.name}}</option>
                                        </select>                                                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='paging'" style="width:75%; padding:35px; display:flex; flex-direction:column; background-color:#f2ecdc; align-items:center; justify-content:center;">
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">

                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Enable Paging</span></div>
                                <div>
                                    <input type="checkbox" @change="handleEnablePaging" v-model="chkEnablePaging" id="enablePaging" name="enablePaging" value="true">
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:15px; align-items:center;">
                                <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Paging Text Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'PagingTextColor')}" v-model="localActiveColorScheme.pagingTextColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'PagingTextColor')}" class='colorPicker' :value='localActiveColorScheme.pagingTextColor'>
                                </div>
                            </div>                         
                            <br>
                            <hr style="height: 1px; width: 100%;">
                            <br>
                            <div style="display:flex; width:100%; justify-content:flex-start; align-items:center;">
                                <div style="width:150px; display:flex; justify-content:flex-start"><span class="mediumText">Enable Slider</span></div>
                                <div>
                                    <input type="checkbox" @change="handleEnableSlider" v-model="chkEnableSlider" id="enableSlider" name="enableSlider" value="true">
                                </div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start;margin-top:15px; align-items:center;">
                                <div style="width:150px; display:flex; justify-content:flex-start;"><span class="mediumText">Slider Fill Color</span></div>
                                <div style='display:flex; align-items:center;'>
                                    <input @input="(event)=>{debounceColorChange(event,'SliderFillColor')}" v-model="localActiveColorScheme.sliderFillColor" type='text' style="width:100px" height="30px">
                                    <input type='color' @input="(event)=>{handleColorPickerChange(event,'SliderFillColor')}" class='colorPicker' :value='localActiveColorScheme.sliderFillColor'>
                                </div>
                            </div>   
                        </div>
                    </div>
                </div>
                <div v-show="currentTab==='slots'" style="width:75%; background-color:#f2ecdc; display:flex; padding:35px; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                        <div style="display:flex; width:100%; justify-content:flex-start;">
                            <div style="width:150px; display:flex; justify-content:flex-start"><span class='mediumText'>Slot Left Of Title</span></div>
                            <select @change="(event)=>handleUpdateGridSettings(event.target.value,'slots','LeftSideOfTitle')" v-model="leftSideOfTitle" style="width:200px;">
                                <option :value="``">Select Component</option>
                                <option v-for="(comp, index) in componentList" :key="index" :value="comp.name">{{comp.name}}</option>
                            </select>                                                                      
                        </div>   
                        <div style="display:flex; width:100%; margin-top:15px; justify-content:flex-start;">
                            <div style="width:150px; display:flex; justify-content:flex-start"><span class='mediumText'>Slot Right Of Title</span></div>
                            <select @change="(event)=>handleUpdateGridSettings(event.target.value,'slots','RightSideOfTitle')" v-model="rightSideOfTitle" style="width:200px;">
                                <option :value="``">Select Component</option>
                                <option v-for="(comp, index) in componentList" :key="index" :value="comp.name">{{comp.name}}</option>
                            </select>                                                                      
                        </div>   
                    </div>
                </div>
                <div v-show="currentTab==='generate'" style="width:75%; background-color:#f2ecdc; display:flex; padding:35px; flex-direction:column; align-items:center; justify-content:center;">
                    <div style='display:flex; justify-content:center; margin-bottom:25px'>
                        <span>Choose Download Option</span>
                    </div>
                    <div style="width:100%; height:100%;">
                        <div style="display:flex; flex-direction:column; justify-content:flex-start;">
                            <div style="display:flex; width:100%; justify-content:flex-start;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span class='mediumText'>Download as .js - ready to drop in.</span></div>
                                <div><button @click="download">Download</button></div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span class='mediumText'>Download as a renamable .js.txt file</span></div>
                                <div><button @click="(event)=>{download(event,'txt')}">Download</button></div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span class='mediumText'>Download as a .zip file</span></div>
                                <div><button @click="(event)=>{download(event,'zip')}">Download</button></div>
                            </div>   
                            <div style="display:flex; width:100%; justify-content:flex-start; margin-top:10px;">
                                <div style="width:300px; display:flex; justify-content:flex-start"><span class='mediumText'>Copy to your clipboard </span></div>
                                <div><button @click="(event)=>{download(event,'copy')}">{{copyButtonText}}</button></div>
                            </div>   
                          </div>
                    </div>
                </div>

            </div>
            <div style="height:2%; border-bottom-right-radius:5px; border-bottom-left-radius:5px; background-color:#577594;">
                &nbsp;
            </div>
        </div> 
    </div>
</template>
<script>
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import debounce from 'lodash.debounce'
export default {
    name:"DeveloperMode",
    components: {
    },
    data() {
        return {
            showWidthError:false,
            availableForCustomizing:0,
            copyButtonText:'Copy',
            devModeWidthValue:0,
            devModeHeightValue:0,
            columnSelected:-1,
            numColumns:0,
            chkEnablePaging:true,
            chkEnableSlider:true,
            chkEnableTitle:true,
            chkEnableHeader:true,
            chkEnableHighlight:true,
            titleText:'',
            leftSideOfTitle:'',
            rightSideOfTitle:'',
            developmentMode:false,
            shouldAnimateConfigTool:false,
            developerModeText:'Developer Mode',
            headerHeight:0, //calculated total of the header use to dictate the height of datarow.
            currentTab:'welcome',
            userHasHeaders:false,
            localActiveColorScheme:{
                sliderFillColor:'',
                pagingTextColor:'',
                gridTitleColor:'',
                gridHeaderTextColor:'',
                gridRowTextColor:'',
                gridHeaderBackgroundColor:'',
                gridRowOddBackgroundColor:'',
                gridRowEvenBackgroundColor:'',
                activeIndicatorColor:'',
                gridHeaderBorderColor:'',
                flyoutBackgroundColor:'',
                flyoutTextColor:'',
                rowHighlightBackground:'',
                rowHighlightActiveCell:''
            },
            localGridSettings:{
                developmentMode:{
                },
                rows:{
                },
                size:{
                },
                colorScheme:{
                },
                title:{
                },
                columns:{
                },
                header:{
                },
                slider:{
                },
                pagination:{
                },
                slots:{
                }
            },          
            localActiveColumnEdit:{
                ColumnHeader:'',
                Index:0,
                Width:'',
                WidthValue:0,
                Alignment:'',
                DataType:'',
                IsUsingACustomWidth:false,
                IsPreSortEnabled:false,
                ChkAuto:true,                     
                IsUsingCustomComponent:false,
                CustomComponentName:'',
                OnCellClick:''
            },   
            localFullDS:[]
        };
    },
    computed: {
    },
    methods: {

///////Emitters///////
        pushGridChange(){
            this.$emit('gridUpdate',{
                gridSettings: this.localGridSettings,
                activeColorScheme: this.localActiveColorScheme,
                activeColumnEdit: this.localActiveColumnEdit,
                fullDS: this.localFullDS
            })
        },

///////End Emitters///////

///////Size Tab///////
        debounceInput: debounce(function (event){
            this.localGridSettings.size.GridWidth = `${event.target.value}px`
            this.localGridSettings.size.GridWidthValue = parseInt(event.target.value)
            this.calculateColumnWidths()
            this.availableForCustomizing = this.calculateAvailableSpace()
            this.pushGridChange()
        },750),     
        debounceHeightInput: debounce(function (event){
            this.localGridSettings.size.GridHeight = `${event.target.value}px`
            this.localGridSettings.size.GridHeightValue = parseInt(event.target.value)
                //this.viewportHeight = this.localGridSettings.size.GridHeightValue - this.headerHeight TO DO - NOT SURE IF THIS IS NEEDED NOW
            this.pushGridChange()
        },750),               
//////End Size Tab///////

//////Columns Tab/////////
        handleUpdateGridColumns(event,property){
            this.localGridSettings.columns[this.localActiveColumnEdit.Index][property] = event.target.value
            this.pushGridChange()
        },
        handleIsCustomComponent(event){
            console.log("event", event)
            if (event.target.checked === true) {
                console.log("markin them")
                this.handleUpdateGridColumns({target:{value:true}},'IsUsingCustomComponent')
            } else {
                this.handleUpdateGridColumns({target:{value:''}},'CustomComponentName')
                this.handleUpdateGridColumns({target:{value:false}},'IsUsingCustomComponent')
            }
        },
        handleColumnEdit(event){
            if (event.target.value>-1) {
            this.columnSelected=event.target.value;
                this.localActiveColumnEdit = {
                    ColumnHeader:this.localGridSettings.columns[event.target.value].ColumnHeader,
                    Index:this.localGridSettings.columns[event.target.value].Index,
                    Width: this.localGridSettings.columns[event.target.value].IsUsingACustomWidth?this.localGridSettings.columns[event.target.value].Width:'',
                    WidthValue: this.localGridSettings.columns[event.target.value].IsUsingACustomWidth?this.localGridSettings.columns[event.target.value].WidthValue:null,
                    Alignment:this.localGridSettings.columns[event.target.value].Alignment,
                    DataType:this.localGridSettings.columns[event.target.value].DataType,
                    IsUsingACustomWidth:this.localGridSettings.columns[event.target.value].IsUsingACustomWidth,
                    IsPreSortEnabled:this.localGridSettings.columns[event.target.value].IsPreSortEnabled,
                    ChkAuto:this.localGridSettings.columns[event.target.value].IsUsingACustomWidth?false:true,
                    IsUsingCustomComponent:this.localGridSettings.columns[event.target.value].IsUsingCustomComponent,
                    CustomComponentName:this.localGridSettings.columns[event.target.value].CustomComponentName?this.localGridSettings.columns[event.target.value].CustomComponentName:''

                }            
                
            } else {
                this.localActiveColumnEdit={
                    ColumnHeader:'',
                    Index:0,
                    Width:'',
                    WidthValue:0,
                    Alignment:'',
                    DataType:'',
                    IsUsingACustomWidth:false,
                    IsPreSortEnabled:false,
                    ChkAuto:true
                }
            }
        },
        handleColNumChange(event){

            if (this.localGridSettings.columns.length<event.target.value) {
                let numToPush = event.target.value - this.localGridSettings.columns.length
                let index = this.localGridSettings.columns.length
                for (let i = 0; i < numToPush; i++) {
                    this.localGridSettings.columns.push(
                        {
                            ColumnHeader:'Column',
                            Index:index,
                            Width:'',
                            WidthValue:0,
                            Alignment:'center',
                            DataType:'string',
                            IsPreSortEnabled:false                            
                        }
                    )
                    index++
                }
                this.$emit('addGridColumn')         
                for (let j = 0; j < numToPush; j++) {

                    for (let i = 0; i < this.localFullDS.length; i++) {
                        this.localFullDS[i].data.push('Data')
                    }
                }
            } else {
                let currentCount = this.localGridSettings.columns.length
                let numToPop = currentCount - event.target.value
                let tmp = [...this.localGridSettings.columns]
                
                this.localGridSettings.columns = tmp.splice(0,currentCount-numToPop)
                let tmpDS = [...this.localFullDS]
                console.log(tmpDS)
                for (let i = 0; i < tmpDS.length; i++) {
                    //for each row, we need to take one data item off the data array
                    tmpDS[i].data = [...tmpDS[i].data.splice(0,tmpDS[i].data.length-1)]                    
                }
                console.log(tmpDS)
                this.localFullDS = tmpDS
            }
            this.calculateColumnWidths() 
            this.availableForCustomizing= this.calculateAvailableSpace()  
            
            this.pushGridChange()
        },
        debounceHandleCustomWidth: debounce(function (event){
            if(event.target.value > this.availableForCustomizing){
                this.localActiveColumnEdit.Width=null;
                this.localActiveColumnEdit.WidthValue=null;
                this.localActiveColumnEdit.ChkAuto=true
                this.localGridSettings.columns[this.localActiveColumnEdit.Index].IsUsingACustomWidth=false
                this.showWidthError = true;
                setTimeout(() => {
                    this.showWidthError = false;
                }, 3000);
            } else {
                this.localGridSettings.columns[this.localActiveColumnEdit.Index].Width=event.target.value+'px';
                this.localGridSettings.columns[this.localActiveColumnEdit.Index].WidthValue=parseInt(event.target.value);
                this.localGridSettings.columns[this.localActiveColumnEdit.Index].IsUsingACustomWidth=event.target.value>0
                this.localActiveColumnEdit.ChkAuto=!event.target.value>0
            }
            this.calculateColumnWidths()            
            this.availableForCustomizing=this.calculateAvailableSpace()            
        },750), 
        handleAutoSize(){
            this.localActiveColumnEdit.IsUsingACustomWidth=false;
            this.localActiveColumnEdit.Width=null
            this.localActiveColumnEdit.WidthValue=null
            this.localActiveColumnEdit.ChkAuto = true;
            this.localGridSettings.columns[this.localActiveColumnEdit.Index].IsUsingACustomWidth = false
            this.localGridSettings.columns[this.localActiveColumnEdit.Index].Width = null
            this.localGridSettings.columns[this.localActiveColumnEdit.Index].WidthValue = null
            this.calculateColumnWidths()
            this.availableForCustomizing = this.calculateAvailableSpace()
        },
//////End Columns Tab/////////

//////Slider/Paging Tab/////////
        handleEnablePaging(event){
            this.localGridSettings.pagination.Enabled = event.target.checked; 
            if (this.localGridSettings.pagination.Enabled===false){
                this.localGridSettings.slider.Enabled=false
                this.chkEnableSlider = false
            }
            this.pushGridChange()
        },
        handleEnableSlider(event){
            this.localGridSettings.slider.Enabled = event.target.checked
            if(this.localGridSettings.slider.Enabled){
                this.localGridSettings.pagination.Enabled = true; 
                this.chkEnablePaging=true
                this.chkEnableSlider=true
            }
            this.pushGridChange()
        },
//////End Slider/Paging Tab/////////

//////Generate Config Tab/////////
        generateConfig(){
let config = `let shiftSettings = {
    developmentMode:{
        Enabled:false
    },
    size:{
        GridWidth:'${this.localGridSettings.size.GridWidthValue}px', //px value of width
        GridWidthValue:${this.localGridSettings.size.GridWidthValue},
        GridHeight:'${this.localGridSettings.size.GridHeightValue}px', //px value of height
        GridHeightValue:${this.localGridSettings.size.GridHeightValue}, //int value used for calculations
    },
    header:{
        Enabled:${this.localGridSettings.header.Enabled}
    },
    rows:{
        Height:'${this.localGridSettings.rows.HeightValue}px', //Change at own risk
        HeightValue:${this.localGridSettings.rows.HeightValue}, //Change at own risk
        HighlightRowEnabled:'${this.localGridSettings.rows.HighlightRowEnabled}',
    },
    slider:{ //Change at own risk
        Enabled:${this.localGridSettings.slider.Enabled},
        SliderWidth:${this.localGridSettings.slider.SliderWidth},
        MinValue:${this.localGridSettings.slider.MinValue},
        MaxValue:${this.localGridSettings.slider.MaxValue},
        StepValue:${this.localGridSettings.slider.StepValue},
        InitialValue:${this.localGridSettings.slider.InitialValue}
    },
    pagination:{ //Change at own risk
        Enabled:${this.localGridSettings.pagination.Enabled}, 
        MinRecordsViewable:0,
        MaxRecordsViewable:0,
        TotalNumberOfRecords:0,
        PageNumberCurrentlyViewing:0,        
        MaxPageNumberPossible:0,
        NumberOfApplicibleRowsPerPage:0,
        InitialNumberOfRowsPerPage:0
    },
    title:{
        Enabled:'${this.localGridSettings.title.Enabled}',
        Text:'${this.localGridSettings.title.Text}'
    },
    colorScheme:{
        SliderFillColor:'${this.localGridSettings.colorScheme.SliderFillColor}',
        PagingTextColor:'${this.localGridSettings.colorScheme.PagingTextColor}',
        GridTitleColor:'${this.localGridSettings.colorScheme.GridTitleColor}',
        GridHeaderTextColor:'${this.localGridSettings.colorScheme.GridHeaderTextColor}',
        GridRowTextColor:'${this.localGridSettings.colorScheme.GridRowTextColor}',
        GridHeaderBackgroundColor:'${this.localGridSettings.colorScheme.GridHeaderBackgroundColor}',
        GridRowOddBackgroundColor:'${this.localGridSettings.colorScheme.GridRowOddBackgroundColor}',
        GridRowEvenBackgroundColor:'${this.localGridSettings.colorScheme.GridRowEvenBackgroundColor}',
        ActiveIndicatorColor:'${this.localGridSettings.colorScheme.ActiveIndicatorColor}',
        GridHeaderBorderColor:'${this.localGridSettings.colorScheme.GridHeaderBorderColor}',
        FlyoutBackgroundColor:'${this.localGridSettings.colorScheme.FlyoutBackgroundColor}',
        FlyoutTextColor:'${this.localGridSettings.colorScheme.FlyoutTextColor}',
        RowHighlightBackground:'${this.localGridSettings.colorScheme.RowHighlightBackground}',
        RowHighlightActiveCell:'${this.localGridSettings.colorScheme.RowHighlightActiveCell}',

    },
    slots:{
        LeftSideOfTitle:'${this.localGridSettings.slots.LeftSideOfTitle!==undefined?this.localGridSettings.slots.LeftSideOfTitle:''}',
        RightSideOfTitle:'${this.localGridSettings.slots.RightSideOfTitle!==undefined?this.localGridSettings.slots.RightSideOfTitle:''}'
    },
    columns:[
`           
            let column = ``
            for (let i = 0; i < this.localGridSettings.columns.length; i++) {
                column = 
`        {
            ColumnHeader:'${this.localGridSettings.columns[i].ColumnHeader}',
            Index:${this.localGridSettings.columns[i].Index},
            Width:'${this.localGridSettings.columns[i].Width}',
            WidthValue:${this.localGridSettings.columns[i].WidthValue},
            IsUsingACustomWidth:${this.localGridSettings.columns[i].IsUsingACustomWidth?this.localGridSettings.columns[i].IsUsingACustomWidth:false},
            Alignment:'${this.localGridSettings.columns[i].Alignment}',
            DataType:'${this.localGridSettings.columns[i].DataType}',
            IsPreSortEnabled:${this.localGridSettings.columns[i].IsPreSortEnabled},
            IsUsingCustomComponent:${this.localGridSettings.columns[i].IsUsingCustomComponent!==undefined?this.localGridSettings.columns[i].IsUsingCustomComponent:false},
            CustomComponentName:'${this.localGridSettings.columns[i].CustomComponentName!=='undefined'?this.localGridSettings.columns[i].CustomComponentName:''}',
            OnCellClick:'${this.localGridSettings.columns[i].OnCellClick?this.localGridSettings.columns[i].OnCellClick:''}',
            CellClicked:${false},
        },
`                
            config += column
            }
            config += `
    ]
}
export default shiftSettings
`    
            return config        
        },
        async download(event,downloadAs) {
            let element
            let zip = new JSZip();
            switch (downloadAs) {
                
                case 'zip':
                        zip.file("shift-grid-config.js", this.generateConfig());
                        zip.generateAsync({type: "blob"}).then(function(content) {
                            FileSaver.saveAs(content, "Config.zip");
                            });                    
                    break;
                case 'txt':
                        element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.generateConfig()));
                        element.setAttribute('download', 'shift-grid-config.js.txt')
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    break;
                case 'copy':
                        try {
                            await navigator.clipboard.writeText(this.generateConfig())
                            this.copyButtonText = 'Copied!'
                            setTimeout(() => {
                                this.copyButtonText = 'Copy'
                            }, 3000);
                        } catch (error) {
                            console.log('failed to copy')
                        }

                    break;
                default:
                        element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.generateConfig()));
                        element.setAttribute('download', 'shift-grid-config.js')
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    break;
            }
        },
//////End Generate Config Tab/////////

//////Common Functions///////
        handleUpdateGridSettings(value,object,property){
            this.localGridSettings[object][property] = value
            this.pushGridChange()
        },
        debounceColorChange: debounce(function (event, property){
            this.localGridSettings.colorScheme[property] = event.target.value
            this.pushGridChange()
        },750),      
        handleColorPickerChange(event, property){
            const toLower = (value)=>{
                return value.charAt(0).toLowerCase() + value.slice(1);
            }
            const prop = toLower(property)
            this.localActiveColorScheme[prop] = event.target.value
            this.localGridSettings.colorScheme[property]= event.target.value
            this.pushGridChange()
        },
        setCurrentTab(tab){
            this.currentTab = tab
        },
        calculateColumnWidths(){
            let tmp = 0
            const numCols = this.localGridSettings.columns.length
            let custCols = [] 
            for (let i = 0; i < numCols; i++) {
                if (this.localGridSettings.columns[i].IsUsingACustomWidth) {
                    custCols.push(i)
                    tmp = tmp + this.localGridSettings.columns[i].WidthValue
                }
            }
           const numColumns = numCols-custCols.length
           let widthOfGrid = this.localGridSettings.size.GridWidthValue - tmp
           widthOfGrid = this.boolGridWillScroll?(widthOfGrid-17):widthOfGrid //17 is the px width of the scrollbar
           const eachColumn = Math.floor(widthOfGrid/numColumns)
            for (let i = 0; i < numCols; i++) {
                if (!custCols.includes(i)) {
                    this.localGridSettings.columns[i].Width = `${eachColumn}px`
                    this.localGridSettings.columns[i].WidthValue = eachColumn
                }
            }
        },
        getCustomWidths(){
            let widthData = {}
            let custom = 0
            let rest = 0
            let custCount = 0
            for (let i = 0; i < this.localGridSettings.columns.length; i++) {
                if(this.localGridSettings.columns[i].IsUsingACustomWidth){
                    custom = custom + this.localGridSettings.columns[i].WidthValue
                    custCount++
                } else {
                    rest += this.localGridSettings.columns[i].WidthValue
                }
            }
            widthData.custom = custom
            widthData.rest = rest
            widthData.custCount = custCount
            return widthData 
        },
        calculateAvailableSpace(){
            const widthData = this.getCustomWidths()
            return(widthData.rest)
        },
        initializeDevMode(){
            this.devModeWidthValue = this.localGridSettings.size.GridWidthValue
            this.devModeHeightValue = this.localGridSettings.size.GridHeightValue
            this.localActiveColorScheme.sliderFillColor = this.localGridSettings.colorScheme.SliderFillColor
            this.localActiveColorScheme.pagingTextColor = this.localGridSettings.colorScheme.PagingTextColor
            this.localActiveColorScheme.gridTitleColor = this.localGridSettings.colorScheme.GridTitleColor
            this.localActiveColorScheme.gridHeaderTextColor = this.localGridSettings.colorScheme.GridHeaderTextColor
            this.localActiveColorScheme.gridRowTextColor = this.localGridSettings.colorScheme.GridRowTextColor
            this.localActiveColorScheme.gridHeaderBackgroundColor = this.localGridSettings.colorScheme.GridHeaderBackgroundColor
            this.localActiveColorScheme.gridRowOddBackgroundColor = this.localGridSettings.colorScheme.GridRowOddBackgroundColor
            this.localActiveColorScheme.gridRowEvenBackgroundColor = this.localGridSettings.colorScheme.GridRowEvenBackgroundColor
            this.localActiveColorScheme.activeIndicatorColor = this.localGridSettings.colorScheme.ActiveIndicatorColor
            this.localActiveColorScheme.gridHeaderBorderColor = this.localGridSettings.colorScheme.GridHeaderBorderColor
            this.localActiveColorScheme.flyoutBackgroundColor = this.localGridSettings.colorScheme.FlyoutBackgroundColor
            this.localActiveColorScheme.flyoutTextColor = this.localGridSettings.colorScheme.FlyoutTextColor
            this.localActiveColorScheme.rowHighlightBackground = this.localGridSettings.colorScheme.RowHighlightBackground
            this.localActiveColorScheme.rowHighlightActiveCell = this.localGridSettings.colorScheme.RowHighlightActiveCell
            this.chkEnablePaging = this.localGridSettings.pagination.Enabled
            this.chkEnableSlider = this.localGridSettings.slider.Enabled
            this.chkEnableTitle = this.localGridSettings.title.Enabled 
            this.chkEnableHeader = this.localGridSettings.header.Enabled
            this.chkEnableHighlight = this.localGridSettings.rows.HighlightRowEnabled
            this.titleText = this.localGridSettings.title.Text
            this.leftSideOfTitle = this.localGridSettings.slots.LeftSideOfTitle
            this.rightSideOfTitle = this.localGridSettings.slots.RightSideOfTitle
            this.availableForCustomizing = this.calculateAvailableSpace()
            this.numColumns = this.localGridSettings.columns.length
        }
//////End Common Functions///////
       
    },
    props:{
        gridSettings:{
            type: Object
        },
        activeColorScheme:{
            type: Object
        },
        activeColumnEdit:{
            type:Object
        }, 
        fullDS:{
            type:Array
        },
        componentList:{
            type:Array
        }

    },        
    mounted(){
            this.localGridSettings = {...this.gridSettings}
            this.localActiveColorScheme = {...this.activeColorScheme}
            this.localActiveColumnEdit = {...this.activeColumnEdit}
            this.localFullDS = [...this.fullDS]
        
            this.initializeDevMode()
    }
}
</script>
<style >
       .title{
            font-size:24px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        }
        .pagination{
            width: 100%;
            display:flex;
            flex-direction: row;
            justify-content: flex-end;
        }
        .tab{
            justify-content: flex-start;
            align-items:center;
        }
        .tab :hover{
            transform: scale(1.1);
        }
        .colorPicker{
            border:none;
            cursor: pointer;
            height:30px; 
            background-color:transparent;
            width:30px;
            border-radius:5px;
            outline: none;
        }
        .smallerText{
            font-size: 12px;
        }
        .mediumText{
            font-size:14px
        }
        .fade-in {
        animation: fadeIn ease 1s;
        -webkit-animation: fadeIn ease 1s;
        -moz-animation: fadeIn ease 1s;
        -o-animation: fadeIn ease 1s;
        -ms-animation: fadeIn ease 1s;
        }
        @keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }

        @-moz-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }

        @-webkit-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }

        @-o-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }

        @-ms-keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
        }
</style>
