import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './bit-os-projects.less';
import template from './bit-os-projects.stache';
import OSProjectModel from '../../models/os-project';

export const ViewModel = DefineMap.extend({
    contributionMonth: {
        set: function(raw) {
            for (var i = 0; i < raw.osProjects.length; i++) {
                var project = raw.osProjects[i];
                if (!(project instanceof OSProjectModel)) {
                    raw.osProjects[i] = new OSProjectModel(project);
                }
            }
            return raw;
        }
    }
});

export default Component.extend({
  tag: 'bit-os-projects',
  ViewModel: ViewModel,
  template: template
});
